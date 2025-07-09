import { create } from "zustand";
import { LocaleDateString, normalizeDateUTC } from "../repositories/types";
import { db } from "../repositories/db";

type State = {
  // Store date strings for reliable value-based Set comparison
  tasksByDate: Record<LocaleDateString, Set<string>> | undefined;
};

type Action = {
  loadTracks: () => Promise<void>;
  setTaskChecked: (date: Date, taskId: string, checked: boolean) => void;
  setTasksChecked: (date: Date, taskIds: string[], checked: boolean) => void;
};

export const useTrackStore = create<State & Action>((set) => ({
  tasksByDate: undefined,

  loadTracks: async () => {
    const tasksByDate: Record<LocaleDateString, Set<string>> = {};

    const tracks = await db.tracks.toArray();
    tracks.forEach((track) => {
      const dateString = track.date.toLocaleDateString();
      (tasksByDate[dateString] ??= new Set()).add(track.taskId);
    });

    set(() => ({ tasksByDate }));
  },
  setTaskChecked: async (date: Date, taskId: string, checked: boolean) => {
    set((state) => {
      const dateString = date.toLocaleDateString();

      state.tasksByDate ??= {};
      state.tasksByDate[dateString] = new Set(state.tasksByDate[dateString]);

      if (checked) {
        state.tasksByDate[dateString].add(taskId);
      } else {
        state.tasksByDate[dateString].delete(taskId);
      }
      return {
        tasksByDate: { ...state.tasksByDate },
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
    } catch (error) {
      console.error("Error checking task:", error);
    }
  },
  setTasksChecked: async (date: Date, taskIds: string[], checked: boolean) => {
    set((state) => {
      const dateString = date.toLocaleDateString();

      state.tasksByDate ??= {};
      const tasksByDate = state.tasksByDate;
      tasksByDate[dateString] = new Set(state.tasksByDate?.[dateString]);
      taskIds.forEach((taskId) => {
        if (checked) {
          tasksByDate[dateString].add(taskId);
        } else {
          tasksByDate[dateString].delete(taskId);
        }
      });

      return {
        tasksByDate: { ...state.tasksByDate },
      };
    });

    try {
      const normalizeDate = normalizeDateUTC(date);
      if (checked) {
        await db.tracks.bulkAdd(
          taskIds.map((taskId) => ({
            taskId,
            date: normalizeDate,
          }))
        );
      } else {
        await db.tracks.bulkDelete(
          taskIds.map((taskId) => [taskId, normalizeDate])
        );
      }
    } catch (error) {
      console.error("Error checking tasks:", error);
    }
  },
}));
