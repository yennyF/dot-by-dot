import { create } from "zustand";
import { Task } from "../repositories/types";
import { db } from "../repositories/db";
import { immer } from "zustand/middleware/immer";
import { useTrackStore } from "./TrackStore";
import { LexoRank } from "lexorank";

export const UNGROUPED_KEY = "_ungrouped";

type State = {
  dummyTask: Task | undefined;
  tasksByGroup: Record<string, Task[]>;
};

type Action = {
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "order">) => void;
  updateTask: (
    id: string,
    task: Partial<Pick<Task, "name" | "groupId">>
  ) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, beforeId: string | null) => boolean;
  setDummyTask: (task: Task | undefined) => void;
};

export const useTaskStore = create<State & Action, [["zustand/immer", never]]>(
  immer((set) => ({
    dummyTask: undefined,
    tasksByGroup: {},

    loadTasks: async () => {
      const tasksByGroup: Record<string, Task[]> = {};

      await db.tasks.orderBy("order").each((task) => {
        const key = task.groupId ?? UNGROUPED_KEY;
        (tasksByGroup[key] ??= []).push(task);
      });

      set(() => ({ tasksByGroup }));
    },
    addTask: async (props: Omit<Task, "order">) => {
      let task: Task;

      set((state) => {
        const key = props.groupId ?? UNGROUPED_KEY;
        const tasks = state.tasksByGroup[key] ?? [];

        const firstOrder = tasks[0]?.order;
        const order = firstOrder
          ? LexoRank.parse(firstOrder).genPrev().toString()
          : LexoRank.middle().toString();

        task = { ...props, order };
        (state.tasksByGroup[key] ??= []).unshift(task);
      });

      try {
        await db.tasks.add(task!);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    },
    updateTask: async (
      id: string,
      props: Partial<Pick<Task, "name" | "groupId">>
    ) => {
      set((state) => {
        const key = props.groupId ?? UNGROUPED_KEY;

        const target = state.tasksByGroup[key]?.find((t) => t.id === id);
        if (!target) return;

        Object.assign(target, props);
      });

      try {
        await db.tasks.update(id, props);
      } catch (error) {
        console.error("Error renaming task:", error);
      }
    },
    deleteTask: async (id: string) => {
      // delete track state
      useTrackStore.setState((state) => {
        const updatedTasksByDate = { ...state.tasksByDate };

        for (const date in updatedTasksByDate) {
          updatedTasksByDate[date].delete(id);
        }

        return { tasksByDate: updatedTasksByDate };
      });

      // delete task state
      set((state) => {
        for (const tasks of Object.values(state.tasksByGroup)) {
          const index = tasks.findIndex((t) => t.id === id);
          if (index > -1) {
            tasks.splice(index, 1);
            return;
          }
        }
      });

      try {
        await db.tasks.delete(id);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    },
    moveTask: (id: string, beforeId: string | null) => {
      if (beforeId === id) return true;

      // set((state) => {
      //   if (!state.tasks) return;

      //   let index = state.tasks.findIndex((h) => h.id === id);
      //   if (index < 0) return;

      //   const task = state.tasks[index];

      //   let deletedTasks = state.tasks.splice(index, 1);
      //   if (beforeId === null) {
      //     state.tasks.push(...deletedTasks);
      //   } else {
      //     const beforeIndex = state.tasks.findIndex(
      //       (task) => task.id === beforeId
      //     );
      //     state.tasks.splice(beforeIndex, 0, ...deletedTasks);
      //   }

      //   const key = task.groupId ?? UNGROUPED_KEY;
      //   index = state.tasksByGroup[key].findIndex((h) => h.id === id);
      //   if (index < 0) return;

      //   deletedTasks = state.tasksByGroup[key].splice(index, 1);
      //   if (beforeId === null) {
      //     state.tasksByGroup[key].push(...deletedTasks);
      //   } else {
      //     const beforeIndex = state.tasksByGroup[key].findIndex(
      //       (task) => task.id === beforeId
      //     );
      //     state.tasksByGroup[key].splice(beforeIndex, 0, ...deletedTasks);
      //   }
      // });

      return true;
    },
    setDummyTask: (task: Task | undefined) => set(() => ({ dummyTask: task })),
  }))
);
