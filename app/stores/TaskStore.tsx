import { create } from "zustand";
import { Task } from "../repositories/types";
import { db } from "../repositories/db";

type State = {
  tasks: Task[] | undefined;
  dummyTask: Task | undefined;
  tasksUngrouped: Task[];
  tasksByGroup: Record<string, Task[]>;
};

type Action = {
  loadTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<boolean>;
  updateTask: (id: string, task: Pick<Task, "name">) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  moveTask: (id: string, beforeId: string | null) => boolean;
  setDummyTask: (task: Task | undefined) => void;
};

export const useTaskStore = create<State & Action>((set) => ({
  tasks: undefined,
  dummyTask: undefined,
  tasksByGroup: {},
  tasksUngrouped: [],

  loadTasks: async () => {
    const tasks = await db.tasks.toArray();
    set(() => ({
      tasks,
      tasksByGroup: groupTasksById(tasks),
      tasksUngrouped: tasks.filter((t) => !t.groupId),
    }));
  },
  addTask: async (task: Task) => {
    set((state) => {
      const tasks = state.tasks ? [task, ...state.tasks] : [task];

      const tasksByGroup = state.tasksByGroup;
      let tasksUngrouped = state.tasksUngrouped;

      if (task.groupId) {
        tasksByGroup[task.groupId] = [task, ...tasksByGroup[task.groupId]];
      } else {
        tasksUngrouped = [task, ...tasksUngrouped];
      }
      return {
        tasks,
        tasksUngrouped,
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
  updateTask: async (id: string, task: Pick<Task, "name">) => {
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

      let index = state.tasks.findIndex((h) => h.id === id);
      if (index < 0) return {};

      const groupId = state.tasks[index].groupId;
      const tasksByGroup = state.tasksByGroup;
      let tasksUngrouped = state.tasksUngrouped;

      if (groupId) {
        index = tasksByGroup[groupId].findIndex((h) => h.id === id);
        if (index > -1) {
          tasksByGroup[groupId].splice(index, 1);
          tasksByGroup[groupId] = [...tasksByGroup[groupId]];
        }
      } else {
        index = tasksUngrouped.findIndex((h) => h.id === id);
        if (index > -1) {
          tasksUngrouped.splice(index, 1);
          tasksUngrouped = [...tasksUngrouped];
        }
      }

      state.tasks.splice(index, 1);

      return {
        tasks: [...state.tasks],
        tasksUngrouped,
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
    if (!task.groupId) return acc;
    acc[task.groupId] = acc[task.groupId] || [];
    acc[task.groupId].push(task);
    return acc;
  }, {});
}
