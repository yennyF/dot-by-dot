import { create } from "zustand";
import {
  midnightUTCstring,
  LocaleDateString,
  midnightUTC,
} from "../repositories/types";
import { db } from "../repositories/db";

type State = {
  // Store date strings for reliable value-based Set comparison
  tasksByDate: Record<LocaleDateString, Set<string>> | undefined;
};

type Action = {
  loadTracks: () => Promise<void>;
  addTrack: (date: Date, taskId: string) => void;
  deleteTrack: (date: Date, taskId: string) => void;
  addTracks: (date: Date, taskIds: string[]) => void;
  deleteTracks: (date: Date, taskIds: string[]) => void;
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
  addTrack: async (date: Date, taskId: string) => {
    const dateString = midnightUTCstring(date);
    set((state) => {
      state.tasksByDate ??= {};
      state.tasksByDate[dateString] = new Set(state.tasksByDate[dateString]);
      state.tasksByDate[dateString].add(taskId);
      return {
        tasksByDate: { ...state.tasksByDate },
      };
    });

    try {
      await db.tracks.add({ taskId, date: midnightUTC(date) });
    } catch (error) {
      console.error("Error checking task:", error);
    }
  },
  deleteTrack: async (date: Date, taskId: string) => {
    const dateString = midnightUTCstring(date);
    set((state) => {
      state.tasksByDate ??= {};
      state.tasksByDate[dateString] = new Set(state.tasksByDate[dateString]);
      state.tasksByDate[dateString].delete(taskId);
      return {
        tasksByDate: { ...state.tasksByDate },
      };
    });

    try {
      await db.tracks.delete([taskId, midnightUTC(date)]);
    } catch (error) {
      console.error("Error checking task:", error);
    }
  },
  addTracks: async (date: Date, taskIds) => {
    const dateString = midnightUTCstring(date);
    set((state) => {
      state.tasksByDate ??= {};
      const tasksByDate = state.tasksByDate;
      tasksByDate[dateString] = new Set(state.tasksByDate?.[dateString]);
      taskIds.forEach((taskId) => tasksByDate[dateString].add(taskId));
      return {
        tasksByDate: { ...state.tasksByDate },
      };
    });

    try {
      const normalizedDate = midnightUTC(date);
      await db.tracks.bulkAdd(
        taskIds.map((taskId) => ({ taskId, date: normalizedDate }))
      );
    } catch (error) {
      console.error("Error checking tasks:", error);
    }
  },
  deleteTracks: async (date: Date, taskIds: string[]) => {
    const dateString = midnightUTCstring(date);
    set((state) => {
      state.tasksByDate ??= {};
      const tasksByDate = state.tasksByDate;
      tasksByDate[dateString] = new Set(state.tasksByDate?.[dateString]);
      taskIds.forEach((taskId) => tasksByDate[dateString].delete(taskId));
      return {
        tasksByDate: { ...state.tasksByDate },
      };
    });

    try {
      const normalizedDate = midnightUTC(date);
      await db.tracks.bulkDelete(
        taskIds.map((taskId) => [taskId, normalizedDate])
      );
    } catch (error) {
      console.error("Error checking tasks:", error);
    }
  },
}));
