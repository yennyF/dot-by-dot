import { create } from "zustand";
import { Task } from "../repositories/types";
import { db } from "../repositories/db";

export const UNGROUPED_KEY = "_ungrouped";

type State = {
  tasks: Task[] | undefined;
  dummyTask: Task | undefined;
  tasksByGroup: Record<string, Task[]>;
};

type Action = {
  loadTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<boolean>;
  updateTask: (
    id: string,
    task: Pick<Task, "name" | "groupId">
  ) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  moveTask: (id: string, beforeId: string | null) => boolean;
  setDummyTask: (task: Task | undefined) => void;
};

export const useTaskStore = create<State & Action>((set) => ({
  tasks: undefined,
  dummyTask: undefined,
  tasksByGroup: {},

  loadTasks: async () => {
    const tasks = await db.tasks.toArray();
    set(() => ({
      tasks,
      tasksByGroup: groupTasksById(tasks),
    }));
  },
  addTask: async (task: Task) => {
    set((state) => {
      const tasks = state.tasks ? [task, ...state.tasks] : [task];

      const tasksByGroup = state.tasksByGroup;
      const key = task.groupId ?? UNGROUPED_KEY;
      tasksByGroup[key] = [task, ...tasksByGroup[key]];

      return {
        tasks,
        tasksByGroup,
      };
    });

    try {
      await db.tasks.add(task);
    } catch (error) {
      console.error("Error adding task:", error);
      return false;
    }
    return true;
  },
  updateTask: async (id: string, task: Pick<Task, "name" | "groupId">) => {
    set((state) => {
      if (!state.tasks) return {};

      const target = state.tasks.find((h) => h.id === id);
      if (!target) return {};

      Object.assign(target, task);
      return {};
    });

    try {
      await db.tasks.update(id, task);
    } catch (error) {
      console.error("Error renaming task:", error);
      return false;
    }
    return true;
  },
  deleteTask: async (id: string) => {
    set((state) => {
      if (!state.tasks) return {};

      const taskIndex = state.tasks.findIndex((h) => h.id === id);
      if (taskIndex < 0) return {};

      const task = state.tasks[taskIndex];
      const key = task.groupId ?? UNGROUPED_KEY;

      // Create new tasks array without the task
      const tasks = [
        ...state.tasks.slice(0, taskIndex),
        ...state.tasks.slice(taskIndex + 1),
      ];

      const groupTasks = state.tasksByGroup[key] ?? [];
      const groupTaskIndex = groupTasks.findIndex((h) => h.id === id);
      if (groupTaskIndex < 0) return {};

      // Create a new group array without the task
      const updatedGroupTasks = [
        ...groupTasks.slice(0, groupTaskIndex),
        ...groupTasks.slice(groupTaskIndex + 1),
      ];

      // Create new tasksByGroup object with updated group
      const tasksByGroup = {
        ...state.tasksByGroup,
        [key]: updatedGroupTasks,
      };

      return {
        tasks,
        tasksByGroup,
      };
    });

    try {
      await db.tasks.delete(id);
    } catch (error) {
      console.error("Error deleting task:", error);
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

function groupTasksById(tasks: Task[]): Record<string, Task[]> {
  return tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const key = task.groupId ?? UNGROUPED_KEY;
    (acc[key] ??= []).push(task);
    return acc;
  }, {});
}
