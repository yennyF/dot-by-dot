import { create } from "zustand";
import { LocaleDateString, normalizeDateUTC } from "./repositories/types";
import { db } from "./repositories/db";

// Store date strings for reliable value-based Set comparison
export type GroupTask = Record<string, Set<LocaleDateString>>;
export type DateGroup = Record<LocaleDateString, Set<number>>;

type Store = {
  taskGroup: GroupTask | undefined;
  dateGroup: DateGroup | undefined;
  loadTaskGroup: () => Promise<void>;
  loadDateGroup: () => Promise<void>;
  setTaskChecked: (date: Date, taskId: number, checked: boolean) => void;
};

export const useStore = create<Store>((set) => ({
  tasks: undefined,
  taskGroup: undefined,
  dateGroup: undefined,
  loadTaskGroup: async () => {
    const tasks = await db.tasks.toArray();
    const entries = await Promise.all(
      tasks.map(async (task) => {
        const tracks = await db.tracks
          .where("taskId")
          .equals(task.id)
          .toArray();
        const dates = tracks.map((track) => track.date.toLocaleDateString());
        return [task.id, new Set(dates)];
      })
    );
    set(() => ({ taskGroup: Object.fromEntries(entries) }));
  },
  loadDateGroup: async () => {
    const tracks = await db.tracks.toArray();
    const entries = await Promise.all(
      tracks.map(async (track) => {
        const tracks = await db.tracks
          .where("date")
          .equals(normalizeDateUTC(track.date))
          .toArray();
        const taskIds = tracks.map((track) => track.taskId);
        return [track.date.toLocaleDateString(), new Set(taskIds)];
      })
    );
    set(() => ({ dateGroup: Object.fromEntries(entries) }));
  },
  setTaskChecked: async (date: Date, taskId: number, checked: boolean) => {
    set((state) => {
      const dateString = date.toLocaleDateString();

      const newTaskGroup = { ...state.taskGroup };
      newTaskGroup[taskId] = new Set(state.taskGroup?.[taskId]);
      const newDateGroup = { ...state.dateGroup };
      newDateGroup[dateString] = new Set(state.dateGroup?.[dateString]);

      if (checked) {
        newTaskGroup[taskId].add(date.toLocaleDateString());
        newDateGroup[dateString].add(taskId);
      } else {
        newTaskGroup[taskId].delete(date.toLocaleDateString());
        newDateGroup[dateString].delete(taskId);
      }
      return {
        taskGroup: newTaskGroup,
        dateGroup: newDateGroup,
      };
    });

    try {
      if (checked) {
        await db.tracks.add({
          taskId,
          date: normalizeDateUTC(date),
        });
      } else {
        await db.tracks.delete([taskId, date]);
      }
    } catch {
      // TODO rollback and message
    }
  },
}));
