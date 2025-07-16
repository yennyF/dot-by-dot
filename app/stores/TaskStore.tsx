import { create } from "zustand";
import { Task } from "../repositories/types";
import { db } from "../repositories/db";
import { immer } from "zustand/middleware/immer";
import { useTrackStore } from "./TrackStore";
import { LexoRank } from "lexorank";

export const UNGROUPED_KEY = "_ungrouped";

type State = {
  dummyTask: Task | undefined;
  tasksByGroup: Record<string, Task[]> | undefined; // undefined = loading
};

type Action = {
  loadTasks: () => Promise<void>;
  addTask: (props: Pick<Task, "id" | "name" | "groupId">) => void;
  updateTask: (id: string, task: Pick<Task, "name" | "groupId">) => void;
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
      const tasksByGroup: Record<string, Task[]> = {};

      await db.tasks.orderBy("order").each((task) => {
        const key = task.groupId ?? UNGROUPED_KEY;
        (tasksByGroup[key] ??= []).push(task);
      });

      set(() => ({ tasksByGroup }));
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
          const locTask = locateTask(id, tasksByGroup);
          if (!locTask) throw Error();
          const task = tasksByGroup[locTask.key][locTask.index];
          tasksByGroup[locTask.key].splice(locTask.index, 1);

          // Add to new position
          const newIndex = tasksByGroup[key].findIndex(
            (t) => t.id === beforeId
          );
          if (newIndex < 0) throw Error();
          tasksByGroup[key].splice(newIndex, 0, task);

          // Calculate new order
          const prevTask = tasksByGroup[key][newIndex - 1];
          const nextTask = tasksByGroup[key][newIndex + 1]; // beforeId
          const rank = prevTask
            ? LexoRank.parse(prevTask.order).between(
                LexoRank.parse(nextTask.order)
              )
            : LexoRank.parse(nextTask.order).genPrev();

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
          const current = locateTask(id, tasksByGroup);
          if (!current) throw Error();
          const task = tasksByGroup[current.key][current.index];
          tasksByGroup[current.key].splice(current.index, 1);

          if (afterId) {
            // Add to new position
            const newIndex = tasksByGroup[key].findIndex(
              (t) => t.id === afterId
            );
            if (newIndex < 0) return Error();
            const safeIndex = Math.min(newIndex + 1, tasksByGroup[key].length);
            tasksByGroup[key].splice(safeIndex, 0, task);

            // Calculate new order
            const prev = tasksByGroup[key][safeIndex - 1];
            const next = tasksByGroup[key][safeIndex + 1]; // afterId
            const rank = prev
              ? LexoRank.parse(prev.order).between(LexoRank.parse(next.order))
              : LexoRank.parse(next.order).genPrev();
            props = {
              groupId: groupId || undefined,
              order: rank.toString(),
            };
          } else {
            // Add to new position
            tasksByGroup[key].push(task);

            // Calculate new order
            const prevTask = tasksByGroup[key][tasksByGroup[key].length - 2];
            const rank = prevTask
              ? LexoRank.parse(prevTask.order).genNext()
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
        console.error("Error moving task to another group:", error);
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
