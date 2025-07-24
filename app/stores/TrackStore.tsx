import { create } from "zustand";
import {
  midnightUTCstring,
  LocaleDateString,
  midnightUTC,
  timeoutPromise,
} from "../repositories/types";
import { db } from "../repositories/db";
import { debounce } from "lodash";
import {
  notifyCreateError,
  notifyDeleteError,
  notifyLoadError,
} from "../components/Notification";

function autoLock() {
  useTrackStore.getState().setLock(true);
}
export const debouncedAutoLock = debounce(autoLock, 10000);

type State = {
  // Store date strings for reliable value-based Set comparison
  tasksByDate: Record<LocaleDateString, Set<string>> | undefined;
  lock: boolean;
  setLock: (lock: boolean) => void;
};

type Action = {
  initTracks: (start: Date, end: Date) => Promise<void>;
  loadMoreTracks: (start: Date, end: Date) => Promise<void>;
  addTrack: (date: Date, taskId: string) => void;
  addTracks: (date: Date, taskIds: string[]) => void;
  deleteTrack: (date: Date, taskId: string) => void;
  deleteTracks: (date: Date, taskIds: string[]) => void;
};

export const useTrackStore = create<State & Action>((set, get) => ({
  tasksByDate: undefined,
  lock: true,

  initTracks: async (start: Date, end: Date) => {
    start = midnightUTC(start);
    end = midnightUTC(end);
    const tasksByDate: Record<LocaleDateString, Set<string>> = {};

    try {
      await db.tracks
        .where("date")
        .between(start, end, true, true)
        .each((track) => {
          const dateString = track.date.toLocaleDateString();
          (tasksByDate[dateString] ??= new Set()).add(track.taskId);
        });
      set(() => ({ tasksByDate }));
    } catch (error) {
      console.error("Error initialing tasks:", error);
      notifyLoadError();
    }
  },
  loadMoreTracks: async (start: Date, end: Date) => {
    start = midnightUTC(start);
    end = midnightUTC(end);
    const tasksByDate = { ...get().tasksByDate };

    try {
      await db.tracks
        .where("date")
        .between(start, end, true, false)
        .each((track) => {
          const dateString = track.date.toLocaleDateString();
          (tasksByDate[dateString] ??= new Set()).add(track.taskId);
        });
      console.log(await timeoutPromise(5000));
      set(() => ({ tasksByDate }));
    } catch (error) {
      console.error("Error loading more tasks:", error);
      notifyLoadError();
    }
  },
  addTrack: async (date: Date, taskId: string) => {
    const dateString = midnightUTCstring(date);
    date = midnightUTC(date);

    set((state) => {
      const tasksByDate = { ...state.tasksByDate };
      tasksByDate[dateString] = new Set(tasksByDate[dateString]);
      tasksByDate[dateString].add(taskId);
      return { tasksByDate };
    });

    try {
      await db.tracks.add({ taskId, date });
    } catch (error) {
      console.error("Error checking task:", error);
      notifyCreateError();
    }
  },
  addTracks: async (date: Date, taskIds) => {
    const dateString = midnightUTCstring(date);
    set((state) => {
      const tasksByDate = { ...state.tasksByDate };
      tasksByDate[dateString] = new Set(state.tasksByDate?.[dateString]);
      taskIds.forEach((taskId) => tasksByDate[dateString].add(taskId));
      return { tasksByDate };
    });

    try {
      date = midnightUTC(date);
      await db.tracks.bulkAdd(taskIds.map((taskId) => ({ taskId, date })));
    } catch (error) {
      console.error("Error checking tasks:", error);
      notifyCreateError();
    }
  },
  deleteTrack: async (date: Date, taskId: string) => {
    const dateString = midnightUTCstring(date);
    date = midnightUTC(date);

    set((state) => {
      if (!state.tasksByDate) return {};

      const tasksByDate = { ...state.tasksByDate };
      tasksByDate[dateString] = new Set(state.tasksByDate[dateString]);
      tasksByDate[dateString].delete(taskId);
      return { tasksByDate };
    });

    try {
      await db.tracks.delete([taskId, date]);
    } catch (error) {
      console.error("Error checking task:", error);
      notifyDeleteError();
    }
  },
  deleteTracks: async (date: Date, taskIds: string[]) => {
    const dateString = midnightUTCstring(date);
    date = midnightUTC(date);

    set((state) => {
      if (!state.tasksByDate) return {};

      const tasksByDate = { ...state.tasksByDate };
      tasksByDate[dateString] = new Set(state.tasksByDate?.[dateString]);
      taskIds.forEach((taskId) => tasksByDate[dateString].delete(taskId));
      return { tasksByDate };
    });

    try {
      await db.tracks.bulkDelete(taskIds.map((taskId) => [taskId, date]));
    } catch (error) {
      console.error("Error checking tasks:", error);
      notifyDeleteError();
    }
  },
  setLock: (lock: boolean) => {
    set(() => ({ lock }));
    debouncedAutoLock();
  },
}));
