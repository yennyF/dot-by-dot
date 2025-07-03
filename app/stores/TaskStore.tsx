import { create } from "zustand";
import { Task } from "../repositories/types";
import { db } from "../repositories/db";

type State = {
  tasks: Task[] | undefined;
  dummyTask: Task | undefined;
};

type Action = {
  loadTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<boolean>;
  updateTask: (id: string, task: Partial<Task>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  moveTask: (id: string, beforeId: string | null) => boolean;
  setDummyTask: (task: Task | undefined) => void;
};

export const useTaskStore = create<State & Action>((set) => ({
  tasks: undefined,
  dummyTask: undefined,
  loadTasks: async () => {
    const tasks = await db.tasks.toArray();
    set(() => ({ tasks }));
  },
  addTask: async (task: Task) => {
    let prevTasks: Task[] | undefined;

    set((state) => {
      if (!state.tasks) {
        return { tasks: [task] };
      }
      prevTasks = [...state.tasks];
      return { tasks: [task, ...state.tasks] };
    });

    try {
      await db.tasks.add(task);
    } catch (error) {
      console.error("Error adding task:", error);

      // Rollback
      set((states) => {
        if (!states.tasks || !prevTasks) return {};
        states.tasks = prevTasks;
        return { tasks: [...states.tasks] };
      });

      return false;
    }
    return true;
  },
  updateTask: async (id: string, task: Partial<Task>) => {
    let prevTask: Task | undefined;

    try {
      set((state) => {
        if (!state.tasks) return {};

        const target = state.tasks.find((h) => h.id === id);
        if (!target) return {};

        prevTask = structuredClone(target);
        Object.assign(target, task);

        return {};
      });
      await db.tasks.update(id, task);
    } catch (error) {
      console.error("Error renaming task:", error);

      // Rollback
      set((states) => {
        if (!states.tasks || !prevTask) return {};

        const index = states.tasks.findIndex((h) => h.id === id);
        if (index < 0) return {};

        states.tasks[index] = prevTask;
        return {};
      });

      return false;
    }

    return true;
  },
  deleteTask: async (id: string) => {
    let prevTasks: Task[] | undefined;

    set((state) => {
      if (!state.tasks) return {};

      const index = state.tasks.findIndex((h) => h.id === id);
      if (index < 0) return {};

      prevTasks = [...state.tasks];
      state.tasks.splice(index, 1);
      return { tasks: [...state.tasks] };
    });

    try {
      await db.tasks.delete(id);
    } catch (error) {
      console.error("Error deleting task:", error);

      // Rollback
      set((states) => {
        if (!states.tasks || !prevTasks) return {};
        states.tasks = prevTasks;
        return { tasks: [...states.tasks] };
      });
      return false;
    }

    return true;
  },
  moveTask: (id: string, beforeId: string | null) => {
    if (beforeId === id) return true;

    set((state) => {
      if (!state.tasks) return {};

      const index = state.tasks.findIndex((h) => h.id === id);
      if (index < 0) return {};

      const deletedTasks = state.tasks.splice(index, 1);
      if (beforeId === null) {
        state.tasks.push(...deletedTasks);
      } else {
        const beforeIndex = state.tasks.findIndex(
          (task) => task.id === beforeId
        );
        state.tasks.splice(beforeIndex, 0, ...deletedTasks);
      }

      return { tasks: [...state.tasks] };
    });

    return true;
  },
  setDummyTask: (task: Task | undefined) => set(() => ({ dummyTask: task })),
}));
