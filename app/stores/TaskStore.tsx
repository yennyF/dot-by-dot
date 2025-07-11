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
  updateTask: (id: string, task: Pick<Task, "name" | "groupId">) => void;
  changeGroup: (id: string, groupId: string | null) => void;
  moveTaskBefore: (id: string, beforeId: string) => void;
  moveTaskAfter: (id: string, afterId: string) => void;
  moveToGroup: (id: string, groupId: string | null) => void;
  deleteTask: (id: string) => void;
  setDummyTask: (task: Task | undefined) => void;
  findTask: (id: string) => Task | null;
};

export const useTaskStore = create<State & Action, [["zustand/immer", never]]>(
  immer((set, get) => ({
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
      let task: Task | undefined;

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
        if (!task) return;
        await db.tasks.add(task);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    },
    updateTask: async (id: string, props: Pick<Task, "name">) => {
      set((state) => {
        const task = state.findTask(id);
        if (!task) return;
        task.name = props.name;
      });

      try {
        await db.tasks.update(id, props);
      } catch (error) {
        console.error("Error renaming task:", error);
      }
    },
    changeGroup: async (id: string, groupId: string | null) => {
      set((state) => {
        const localaedTask = locateTask(id, state.tasksByGroup);
        if (!localaedTask) return;

        const task = state.tasksByGroup[localaedTask.key].splice(
          localaedTask.index,
          1
        )[0];

        const key = groupId ?? UNGROUPED_KEY;
        state.tasksByGroup[key].push(task);

        task.groupId = groupId || undefined;
      });

      try {
        await db.tasks.update(id, { groupId: groupId ?? undefined });
      } catch (error) {
        console.error("Error renaming task:", error);
      }
    },
    moveTaskBefore: async (id: string, beforeId: string) => {
      if (beforeId === id) return true;

      let newOrder: string | undefined;
      let newGroupId: string | undefined;

      set(({ tasksByGroup }) => {
        if (!tasksByGroup) return;

        // Remove from current position
        const locTask = locateTask(id, tasksByGroup);
        if (!locTask) return;
        const task = tasksByGroup[locTask.key][locTask.index];
        tasksByGroup[locTask.key].splice(locTask.index, 1);

        // Add to new position
        const locBefore = locateTask(beforeId, tasksByGroup);
        if (!locBefore) return;
        const beforeTask = tasksByGroup[locBefore.key][locBefore.index];
        const afterTask = tasksByGroup[locBefore.key][locBefore.index - 1];
        tasksByGroup[locBefore.key].splice(locBefore.index, 0, task);

        // Update order
        const beforeRank = LexoRank.parse(beforeTask.order);
        if (afterTask) {
          const afterRank = LexoRank.parse(afterTask.order);
          newOrder = afterRank.between(beforeRank).toString();
        } else {
          newOrder = beforeRank.genPrev().toString();
        }
        newGroupId = beforeTask.groupId;
        task.order = newOrder;
        task.groupId = newGroupId;
      });

      try {
        if (newOrder) {
          await db.tasks.update(id, { groupId: newGroupId, order: newOrder });
        }
      } catch (error) {
        console.error("Error moving task:", error);
      }
    },
    moveTaskAfter: async (id: string, afterId: string) => {
      if (afterId === id) return true;

      let newOrder: string | undefined;
      let newGroupId: string | undefined;

      set(({ tasksByGroup }) => {
        if (!tasksByGroup) return;

        // Remove from current position
        const current = locateTask(id, tasksByGroup);
        if (!current) return;
        const task = tasksByGroup[current.key][current.index];
        tasksByGroup[current.key].splice(current.index, 1);

        // Add to new position
        const after = locateTask(afterId, tasksByGroup);
        if (!after) return;
        const afterTask = tasksByGroup[after.key][after.index];
        const beforeTask = tasksByGroup[after.key][after.index + 1];
        const safeIndex = Math.min(
          after.index + 1,
          tasksByGroup[after.key].length
        );
        tasksByGroup[after.key].splice(safeIndex, 0, task);

        // Update order
        const afterRank = LexoRank.parse(afterTask.order);
        if (beforeTask) {
          const beforeRank = LexoRank.parse(beforeTask.order);
          newOrder = afterRank.between(beforeRank).toString();
        } else {
          newOrder = afterRank.genNext().toString();
        }
        newGroupId = afterTask.groupId;
        task.order = newOrder;
        task.groupId = newGroupId;
      });

      try {
        if (newOrder) {
          await db.tasks.update(id, { groupId: newGroupId, order: newOrder });
        }
      } catch (error) {
        console.error("Error moving task:", error);
      }
    },
    moveToGroup: async (id: string, groupId: string | null) => {
      let newOrder: string | undefined;

      set(({ tasksByGroup }) => {
        if (!tasksByGroup) return;

        // Remove from current position
        const current = locateTask(id, tasksByGroup);
        if (!current) return;
        const task = tasksByGroup[current.key][current.index];
        tasksByGroup[current.key].splice(current.index, 1);

        // Add to new position
        const key = groupId ?? UNGROUPED_KEY;
        tasksByGroup[key] ??= [];
        const afterTask = tasksByGroup[key][tasksByGroup[key].length - 1];
        tasksByGroup[key].push(task);

        // Update order
        if (afterTask) {
          const afterRank = LexoRank.parse(afterTask.order);
          newOrder = afterRank.genNext().toString();
        } else {
          newOrder = LexoRank.middle().toString();
        }
        task.order = newOrder;
        task.groupId = groupId || undefined;
      });

      try {
        if (newOrder) {
          await db.tasks.update(id, {
            groupId: groupId || undefined,
            order: newOrder,
          });
        }
      } catch (error) {
        console.error("Error moving task:", error);
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
        const localaedTask = locateTask(id, state.tasksByGroup);
        if (!localaedTask) return;
        state.tasksByGroup[localaedTask.key].splice(localaedTask.index, 1);
      });

      try {
        await db.tasks.delete(id);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    },
    setDummyTask: (task: Task | undefined) => set(() => ({ dummyTask: task })),
    findTask: (id: string) => {
      for (const tasks of Object.values(get().tasksByGroup)) {
        const task = tasks.find((task) => task.id === id);
        if (task) return task;
      }
      return null;
    },
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
