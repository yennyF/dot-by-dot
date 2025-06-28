import { create } from "zustand";
import { LocaleDateString, normalizeDateUTC } from "./repositories/types";
import { db } from "./repositories/db";

type Store = {
  // Store date strings for reliable value-based Set comparison
  datesByTask: Record<string, Set<LocaleDateString>> | undefined;
  tasksByDate: Record<LocaleDateString, Set<number>> | undefined;
  loadTrack: () => Promise<void>;
  setTaskChecked: (date: Date, taskId: number, checked: boolean) => void;
};

export const useStore = create<Store>((set) => ({
  datesByTask: undefined,
  tasksByDate: undefined,
  strikes: undefined,
  loadTrack: async () => {
    const datesByTask: Record<string, Set<LocaleDateString>> = {};
    const tasksByDate: Record<LocaleDateString, Set<number>> = {};

    const tracks = await db.tracks.toArray();
    tracks.forEach((track) => {
      const dateString = track.date.toLocaleDateString();
      (datesByTask[track.taskId] ??= new Set()).add(dateString);
      (tasksByDate[dateString] ??= new Set()).add(track.taskId);
    });

    set(() => ({ datesByTask, tasksByDate }));
  },
  setTaskChecked: async (date: Date, taskId: number, checked: boolean) => {
    set((state) => {
      const dateString = date.toLocaleDateString();

      const newTaskGroup = { ...state.datesByTask };
      newTaskGroup[taskId] = new Set(state.datesByTask?.[taskId]);
      const newDateGroup = { ...state.tasksByDate };
      newDateGroup[dateString] = new Set(state.tasksByDate?.[dateString]);

      if (checked) {
        newTaskGroup[taskId].add(date.toLocaleDateString());
        newDateGroup[dateString].add(taskId);
      } else {
        newTaskGroup[taskId].delete(date.toLocaleDateString());
        newDateGroup[dateString].delete(taskId);
      }
      return {
        datesByTask: newTaskGroup,
        tasksByDate: newDateGroup,
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
