import { create } from "zustand";
import { Task } from "../repositories/types";
import { db } from "../repositories/db";
import { immer } from "zustand/middleware/immer";
import { useTrackStore } from "./TrackStore";
import { LexoRank } from "lexorank";
import {
  notifyCreateError,
  notifyDeleteError,
  notifyLoadError,
  notifyMoveError,
  notifyUpdateError,
} from "../components/Notification";

export const UNGROUPED_KEY = "_ungrouped";

type State = {
  dummyTask: Task | undefined;
  tasksByGroup: Record<string, Task[]> | undefined; // undefined = loading
};

type Action = {
  loadTasks: () => Promise<void>;
  addTask: (props: Pick<Task, "id" | "name" | "groupId">) => void;
  updateTask: (id: string, task: Pick<Task, "name">) => void;
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
  deleteTask: (id: string) => void;
  setDummyTask: (task: Task | undefined) => void;
};

export const useTaskStore = create<State & Action, [["zustand/immer", never]]>(
  immer((set) => ({
    dummyTask: undefined,
    tasksByGroup: undefined,

    loadTasks: async () => {
      try {
        const tasksByGroup: Record<string, Task[]> = {
          [UNGROUPED_KEY]: [],
        };

        await db.groups.each((group) => {
          tasksByGroup[group.id] = [];
        });

        await db.tasks.orderBy("order").each((task) => {
          const key = task.groupId ?? UNGROUPED_KEY;
          tasksByGroup[key].push(task);
        });

        set(() => ({ tasksByGroup }));
      } catch (error) {
        console.error("Error loading tasks:", error);
        notifyLoadError();
      }
    },
    addTask: async (props: Pick<Task, "id" | "name" | "groupId">) => {
      try {
        let task: Task | undefined;

        set(({ tasksByGroup }) => {
          if (!tasksByGroup) return;

          const key = props.groupId ?? UNGROUPED_KEY;
          const tasks = (tasksByGroup[key] ??= []);

          const firstOrder = tasks[0]?.order;
          const order = firstOrder
            ? LexoRank.parse(firstOrder).genPrev().toString()
            : LexoRank.middle().toString();

          task = { ...props, order };
          tasksByGroup[key].unshift(task);
        });

        if (!task) throw Error();
        await db.tasks.add(task);
      } catch (error) {
        console.error("Error adding task:", error);
        notifyCreateError();
      }
    },
    updateTask: async (id: string, props: Pick<Task, "name">) => {
      try {
        set(({ tasksByGroup }) => {
          if (!tasksByGroup) return;

          const allTasks = Object.values(tasksByGroup).flat();
          const task = allTasks.find((t) => t.id === id);
          if (!task) throw Error();

          task.name = props.name;
        });

        await db.tasks.update(id, props);
      } catch (error) {
        console.error("Error updating task:", error);
        notifyUpdateError();
      }
    },
    moveTaskBefore: async (
      id: string,
      beforeId: string,
      groupId: string | null
    ) => {
      if (beforeId === id) return;

      let props: Pick<Task, "groupId" | "order"> | undefined;

      try {
        set(({ tasksByGroup }) => {
          if (!tasksByGroup) return;

          const key = groupId ?? UNGROUPED_KEY;
          if (!tasksByGroup[key]) throw Error();

          // Remove from current position
          const loc = locateTask(id, tasksByGroup);
          if (!loc) throw Error();
          const task = tasksByGroup[loc.key][loc.index];
          tasksByGroup[loc.key].splice(loc.index, 1);

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
            groupId: groupId ?? undefined,
            order: rank.toString(),
          };
          Object.assign(task, props);
        });

        if (!props) throw Error();
        await db.tasks.update(id, props);
      } catch (error) {
        console.error("Error moving task:", error);
        notifyMoveError();
      }
    },
    moveTaskAfter: async (
      id: string,
      afterId: string | null,
      groupId: string | null
    ) => {
      try {
        let props: Pick<Task, "groupId" | "order"> | undefined;

        set(({ tasksByGroup }) => {
          if (!tasksByGroup) return;

          const key = groupId ?? UNGROUPED_KEY;
          if (!tasksByGroup[key]) throw Error();

          // Remove from current position
          const loc = locateTask(id, tasksByGroup);
          if (!loc) throw Error();
          const task = tasksByGroup[loc.key][loc.index];
          tasksByGroup[loc.key].splice(loc.index, 1);

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
              groupId: groupId || undefined,
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
              groupId: groupId || undefined,
              order: rank.toString(),
            };
          }

          // Update task
          Object.assign(task, props);
        });

        if (!props) throw Error();
        await db.tasks.update(id, props);
      } catch (error) {
        console.error("Error moving task:", error);
        notifyMoveError();
      }
    },
    deleteTask: async (id: string) => {
      try {
        // delete track state
        useTrackStore.setState(({ tasksByDate }) => {
          const updatedTasksByDate = { ...tasksByDate };
          for (const date in updatedTasksByDate) {
            updatedTasksByDate[date].delete(id);
          }
          return { tasksByDate: updatedTasksByDate };
        });

        // delete task state
        set(({ tasksByGroup }) => {
          if (!tasksByGroup) return;

          const loc = locateTask(id, tasksByGroup);
          if (!loc) return;
          tasksByGroup[loc.key].splice(loc.index, 1);
        });

        await db.tasks.delete(id);
      } catch (error) {
        console.error("Error deleting task:", error);
        notifyDeleteError();
      }
    },
    setDummyTask: (task: Task | undefined) => set(() => ({ dummyTask: task })),
  }))
);

function locateTask(
  id: string,
  tasksByGroup: Record<string, Task[]>
): { key: string; index: number } | null {
  for (const [key, tasks] of Object.entries(tasksByGroup)) {
    const index = tasks.findIndex((task) => task.id === id);
    if (index > -1) return { key, index };
  }
  return null;
}
