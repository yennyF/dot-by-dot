import { supabase } from "../supabase/server";
import { create } from "zustand";
import { ApiTask, Task, mapTaskRequest, mapTaskResponseArray } from "../types";
import { immer } from "zustand/middleware/immer";
import { useTaskLogStore } from "./taskLogStore";
import { LexoRank } from "lexorank";
import {
  notifyCreateError,
  notifyDeleteError,
  notifyMoveError,
  notifyUpdateError,
} from "../components/Notification";
import { subscribeWithSelector } from "zustand/middleware";

export const UNGROUPED_KEY = "_ungrouped";

type State = {
  dummyTask: Task | undefined;
  tasksByGroup: Record<string, Task[]> | undefined;
};

type Action = {
  destroyTasks: () => void;
  setDummyTask: (task: Task | undefined) => void;
  fetchTasks: () => Promise<void>;
  insertTask: (
    props: Pick<Task, "id" | "name">,
    groupId: string | null
  ) => void;
  updateTask: (
    id: string,
    task: Pick<Task, "name">,
    groupId: string | null
  ) => void;
  moveTaskBefore: (
    id: string,
    beforeId: string,
    groupId: string | null
  ) => void;
  moveTaskAfter: (
    id: string,
    afterId: string | null,
    groupId: string | null
  ) => void;
  deleteTask: (id: string, groupId: string | null) => void;
};

export const useTaskStore = create<State & Action>()(
  subscribeWithSelector(
    immer((set, get) => ({
      dummyTask: undefined,
      setDummyTask: (task: Task | undefined) =>
        set(() => ({ dummyTask: task })),

      tasksByGroup: undefined,

      destroyTasks: async () => {
        set(() => ({
          dummyTask: undefined,
          tasksByGroup: undefined,
        }));
      },

      fetchTasks: async () => {
        try {
          const { data, error } = await supabase
            .from("tasks")
            .select("id, name, group_id, order, user_id")
            .order("order", { ascending: true });

          if (error) throw error;

          const tasksByGroup: Record<string, Task[]> = {};
          if (data) {
            mapTaskResponseArray(data).forEach((task) => {
              const key = task.groupId ?? UNGROUPED_KEY;
              (tasksByGroup[key] ??= []).push(task);
            });
          }

          set(() => ({ tasksByGroup }));
        } catch (error) {
          console.error(error);
          throw error;
        }
      },

      insertTask: async (
        props: Pick<Task, "id" | "name">,
        groupId: string | null
      ) => {
        try {
          const key = groupId ?? UNGROUPED_KEY;

          const firstOrder = get().tasksByGroup?.[key]?.[0]?.order;
          const order = firstOrder
            ? LexoRank.parse(firstOrder).genPrev().toString()
            : LexoRank.middle().toString();

          const task: Task = {
            ...props,
            groupId,
            order,
          };

          // insert in local
          set(({ tasksByGroup }) => {
            if (!tasksByGroup) tasksByGroup = {};
            (tasksByGroup[key] ??= []).unshift(task);
          });

          // insert in db
          const { error } = await supabase
            .from("tasks")
            .insert(mapTaskRequest(task));
          if (error) throw error;
        } catch (error) {
          console.error(error);
          notifyCreateError();
        }
      },

      updateTask: async (
        id: string,
        props: Pick<ApiTask, "name">,
        groupId: string | null
      ) => {
        const key = groupId ?? UNGROUPED_KEY;

        try {
          // update in local
          set(({ tasksByGroup }) => {
            if (!tasksByGroup) return;

            const task = tasksByGroup[key].find((t) => t.id === id);
            if (!task) throw Error();

            task.name = props.name;
          });

          // update in db
          const { error } = await supabase
            .from("tasks")
            .update(props)
            .eq("id", id);
          if (error) throw error;
        } catch (error) {
          console.error(error);
          notifyUpdateError();
        }
      },

      moveTaskBefore: async (
        id: string,
        beforeId: string,
        groupId: string | null
      ) => {
        if (beforeId === id) return;

        let props: Pick<ApiTask, "group_id" | "order"> | undefined;

        try {
          set(({ tasksByGroup }) => {
            if (!tasksByGroup) return;

            const key = groupId ?? UNGROUPED_KEY;
            if (!tasksByGroup[key]) tasksByGroup[key] = [];

            // Remove from current position
            const index = tasksByGroup[key].findIndex((t) => t.id === id);
            if (index < 0) throw Error();
            const task = tasksByGroup[key][index];
            tasksByGroup[key].splice(index, 1);

            // Add to new position
            const newIndex = tasksByGroup[key].findIndex(
              (t) => t.id === beforeId
            );
            if (newIndex < 0) throw Error();
            tasksByGroup[key].splice(newIndex, 0, task);

            // Calculate new order
            const prev = tasksByGroup[key][newIndex - 1];
            const next = tasksByGroup[key][newIndex + 1]; // beforeId
            const rank = prev
              ? LexoRank.parse(prev.order).between(LexoRank.parse(next.order))
              : LexoRank.parse(next.order).genPrev();

            // Update task
            props = {
              group_id: groupId,
              order: rank.toString(),
            };
            Object.assign(task, props);
          });

          if (!props) throw Error();

          // update in db
          const { error } = await supabase
            .from("tasks")
            .update(props)
            .eq("id", id);
          if (error) throw error;
        } catch (error) {
          console.error(error);
          notifyMoveError();
        }
      },

      moveTaskAfter: async (
        id: string,
        afterId: string | null,
        groupId: string | null
      ) => {
        try {
          let props: Pick<ApiTask, "group_id" | "order"> | undefined;

          set(({ tasksByGroup }) => {
            if (!tasksByGroup) return;

            const key = groupId ?? UNGROUPED_KEY;
            if (!tasksByGroup[key]) tasksByGroup[key] = [];

            // Remove from current position
            const index = tasksByGroup[key].findIndex((t) => t.id === id);
            if (index < 0) throw Error();
            const task = tasksByGroup[key][index];
            tasksByGroup[key].splice(index, 1);

            if (afterId) {
              // Add to new position
              const newIndex = tasksByGroup[key].findIndex(
                (t) => t.id === afterId
              );
              if (newIndex < 0) return Error();
              tasksByGroup[key].splice(newIndex + 1, 0, task);

              // Calculate new order
              const prev = tasksByGroup[key][newIndex - 1]; // afterId
              const next = tasksByGroup[key][newIndex + 1];
              const rank = next
                ? LexoRank.parse(prev.order).between(LexoRank.parse(next.order))
                : LexoRank.parse(prev.order).genNext();
              props = {
                group_id: groupId || null,
                order: rank.toString(),
              };
            } else {
              // Add to new position
              const newIndex = tasksByGroup[key].length;
              tasksByGroup[key].push(task);

              // Calculate new order
              const prev = tasksByGroup[key][newIndex - 1];
              const rank = prev
                ? LexoRank.parse(prev.order).genNext()
                : LexoRank.middle();
              props = {
                group_id: groupId,
                order: rank.toString(),
              };
            }

            // Update task
            Object.assign(task, props);
          });

          if (!props) throw Error();

          // // update in db
          const { error } = await supabase
            .from("tasks")
            .update(props)
            .eq("id", id);
          if (error) throw error;
        } catch (error) {
          console.error(error);
          notifyMoveError();
        }
      },

      deleteTask: async (id: string, groupId: string | null) => {
        const key = groupId ?? UNGROUPED_KEY;

        try {
          // delete taskLog state
          useTaskLogStore.setState(({ tasksByDate }) => {
            const updatedTasksByDate = { ...tasksByDate };
            for (const date in updatedTasksByDate) {
              updatedTasksByDate[date].delete(id);
            }
            return { tasksByDate: updatedTasksByDate };
          });

          // delete task state
          set(({ tasksByGroup }) => {
            if (!tasksByGroup) return;

            const index = tasksByGroup[key].findIndex((h) => h.id === id);
            if (index < 0) return;

            tasksByGroup[key].splice(index, 1);
          });

          // delete from db
          const response = await supabase.from("tasks").delete().eq("id", id);
          if (response.error) throw response.error;
        } catch (error) {
          console.error(error);
          notifyDeleteError();
        }
      },
    }))
  )
);
