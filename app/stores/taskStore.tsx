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
  tasks: Task[];
  tasksByGroup: Record<string, Task[]>;
};

type Action = {
  destroyTasks: () => void;
  setDummyTask: (task: Task | undefined) => void;
  fetchTasks: () => Promise<void>;
  insertTask: (
    props: Pick<Task, "id" | "name">,
    groupId: string | null
  ) => void;
  updateTask: (id: string, task: Pick<Task, "name">) => void;
  moveTaskBefore: (id: string, beforeId: string) => void;
  moveTask: (id: string, groupId: string | null) => void;
  deleteTask: (id: string) => void;
};

export const useTaskStore = create<State & Action>()(
  subscribeWithSelector(
    immer((set, get) => ({
      dummyTask: undefined,
      setDummyTask: (task: Task | undefined) =>
        set(() => ({ dummyTask: task })),

      tasks: [],
      tasksByGroup: {},

      destroyTasks: async () => {
        set(
          () =>
            ({
              dummyTask: undefined,
              tasks: [],
              tasksByGroup: {},
            }) as State
        );
      },

      fetchTasks: async () => {
        try {
          const { data, error } = await supabase
            .from("tasks")
            .select("id, name, group_id, order, user_id")
            .order("order", { ascending: true });

          if (error) throw error;

          set(() => ({ tasks: data ? mapTaskResponseArray(data) : [] }));
        } catch (error) {
          console.error(error);
          throw error;
        }
      },

      insertTask: async (
        props: Pick<Task, "id" | "name">,
        groupId: string | null
      ) => {
        const first = get().tasks[0];
        const rank = first
          ? LexoRank.parse(first.order).genPrev()
          : LexoRank.middle();

        try {
          const task: Task = {
            ...props,
            groupId,
            order: rank.toString(),
          };

          // insert in local
          set(({ tasks }) => {
            tasks.unshift(task);
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

      updateTask: async (id: string, props: Pick<ApiTask, "name">) => {
        try {
          // update in local
          set(({ tasks }) => {
            const task = tasks.find((t) => t.id === id);
            if (!task) throw error;
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

      moveTaskBefore: async (id: string, beforeId: string) => {
        if (beforeId === id) return;

        let props: Pick<ApiTask, "group_id" | "order"> | undefined;

        try {
          set(({ tasks }) => {
            // Remove from current position
            const index = tasks.findIndex((t) => t.id === id);
            if (index < 0) throw Error();
            const task = tasks[index];
            tasks.splice(index, 1);

            // Add to new position
            const newIndex = tasks.findIndex((t) => t.id === beforeId);
            if (newIndex < 0) throw Error();
            const beforeTask = tasks[newIndex];
            tasks.splice(newIndex, 0, task);

            // Calculate new order
            const prev = tasks[newIndex - 1];
            const next = tasks[newIndex + 1]; // asume it always exists
            const rank = prev
              ? LexoRank.parse(prev.order).between(LexoRank.parse(next.order))
              : LexoRank.parse(next.order).genPrev();

            // Update in local
            props = {
              group_id: beforeTask.groupId,
              order: rank.toString(),
            };
            task.groupId = props.group_id;
            task.order = props.order;
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

      moveTask: async (id: string, groupId: string | null) => {
        try {
          let props: Pick<ApiTask, "group_id" | "order"> | undefined;

          set(({ tasks }) => {
            // Remove from current position
            const index = tasks.findIndex((t) => t.id === id);
            if (index < 0) throw Error();
            const task = tasks[index];
            tasks.splice(index, 1);

            // Add to new position
            tasks.push(task);

            // Calculate new order
            const last = get().tasks[tasks.length - 1];
            const rank = last
              ? LexoRank.parse(last.order).genNext()
              : LexoRank.middle();

            // Update task
            props = {
              group_id: groupId,
              order: rank.toString(),
            };
            task.groupId = props.group_id;
            task.order = props.order;
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

      deleteTask: async (id: string) => {
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
          set(({ tasks }) => {
            const index = tasks.findIndex((t) => t.id === id);
            if (index > -1) {
              tasks.splice(index, 1);
            }
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

useTaskStore.subscribe(
  (state) => state.tasks,
  (tasks) => {
    const tasksByGroup: Record<string, Task[]> = {};

    for (const task of tasks) {
      const key = task.groupId ?? UNGROUPED_KEY;
      (tasksByGroup[key] ??= []).push(task);
    }

    useTaskStore.setState({ tasksByGroup });
  }
);
