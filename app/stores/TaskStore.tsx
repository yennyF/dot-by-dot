import { create } from "zustand";
import { Task } from "../repositories/types";
import { db } from "../repositories/db";
import { immer } from "zustand/middleware/immer";
import { useTrackStore } from "./TrackStore";

export const UNGROUPED_KEY = "_ungrouped";

type State = {
  dummyTask: Task | undefined;
  tasksByGroup: Record<string, Task[]>;
};

type Action = {
  loadTasks: () => Promise<void>;
  addTask: (task: Task) => void;
  updateTask: (
    id: string,
    task: Partial<Pick<Task, "name" | "groupId">>
  ) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, beforeId: string | null) => boolean;
  findTaskById: (id: string) => Task | undefined;
  setDummyTask: (task: Task | undefined) => void;
};

export const useTaskStore = create<State & Action, [["zustand/immer", never]]>(
  immer((set, get) => ({
    dummyTask: undefined,
    tasksByGroup: {},

    loadTasks: async () => {
      const tasks = await db.tasks.toArray();
      const tasksByGroup = tasks.reduce<Record<string, Task[]>>((acc, task) => {
        const key = task.groupId ?? UNGROUPED_KEY;
        (acc[key] ??= []).push(task);
        return acc;
      }, {});

      set(() => ({ tasksByGroup }));
    },
    addTask: async (task: Task) => {
      set((state) => {
        const key = task.groupId ?? UNGROUPED_KEY;
        (state.tasksByGroup[key] ??= []).unshift(task);
      });

      try {
        await db.tasks.add(task);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    },
    updateTask: async (
      id: string,
      task: Partial<Pick<Task, "name" | "groupId">>
    ) => {
      set((state) => {
        const key = task.groupId ?? UNGROUPED_KEY;
        const target = state.tasksByGroup[key]?.find((t) => t.id === id);
        if (!target) return;
        Object.assign(target, task);
      });

      try {
        await db.tasks.update(id, task);
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
        const task = get().findTaskById(id);
        if (!task) return;

        const key = task.groupId ?? UNGROUPED_KEY;
        const index = state.tasksByGroup[key]?.findIndex((h) => h.id === id);
        if (index < 0) return;
        state.tasksByGroup[key].splice(index, 1);
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
    findTaskById: (id: string) => {
      const { tasksByGroup } = get();
      for (const tasks of Object.values(tasksByGroup)) {
        const found = tasks.find((task) => task.id === id);
        if (found) return found;
      }
      return undefined; // not found
    },
    setDummyTask: (task: Task | undefined) => set(() => ({ dummyTask: task })),
  }))
);
