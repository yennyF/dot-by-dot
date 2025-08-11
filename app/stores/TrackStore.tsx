import { create } from "zustand";
import { Group, LocaleDateString, Task, Track } from "../repositories/types";
import { db } from "../repositories/db";
import {
  notifyCreateError,
  notifyDeleteError,
  notifyLoadError,
  notifyLoading,
} from "../components/Notification";
import { startOfMonth, subMonths } from "date-fns";
import { midnightUTC, midnightUTCstring } from "../util";
import { useTaskStore } from "./TaskStore";
import { useGroupStore } from "./GroupStore";
import { toast } from "react-toastify";

type State = {
  unlock: boolean;
  startDate: Date;
  endDate: Date;
  // Store date strings for reliable value-based Set comparison
  tasksByDate: Record<LocaleDateString, Set<string>> | undefined;
};

type Action = {
  setUnlock: (unlock: boolean) => void;

  destroyTracks: () => void;
  initTracks: () => Promise<void>;
  init: () => Promise<void>;
  loadMorePrevTracks: () => Promise<void>;

  addTrack: (date: Date, taskId: string) => void;
  addTracks: (date: Date, taskIds: string[]) => void;
  deleteTrack: (date: Date, taskId: string) => void;
  deleteTracks: (date: Date, taskIds: string[]) => void;

  clearHistory: () => Promise<void>;
  reset: () => Promise<void>;
  start: (groups: Group[], tasks: Task[], tracks?: Track[]) => Promise<void>;
};

export const useTrackStore = create<State & Action>((set, get) => ({
  unlock: false,
  setUnlock: (unlock: boolean) => {
    set(() => ({ unlock }));
  },

  tasksByDate: undefined,
  startDate: new Date(),
  endDate: new Date(),

  destroyTracks: async () => {
    set(() => ({
      unlock: false,
      asksByDate: undefined,
    }));
  },
  initTracks: async () => {
    const endDate = new Date();
    const startDate = subMonths(startOfMonth(endDate), 3);
    const tasksByDate: Record<LocaleDateString, Set<string>> = {};

    try {
      await db.tracks
        .where("date")
        .between(midnightUTC(startDate), midnightUTC(endDate), true, true)
        .each((track) => {
          const dateString = track.date.toLocaleDateString();
          (tasksByDate[dateString] ??= new Set()).add(track.taskId);
        });

      set(() => ({ tasksByDate, startDate, endDate }));
    } catch (error) {
      console.error("Error initialing tracks:", error);
      throw error;
    }
  },
  init: async () => {
    try {
      await Promise.all([
        useGroupStore.getState().initGroups(),
        useTaskStore.getState().initTasks(),
        get().initTracks(),
      ]);
    } catch (error) {
      console.log("Error initializing", error);
      throw error;
    }
  },
  loadMorePrevTracks: async () => {
    const startDate = subMonths(get().startDate, 1);
    const tasksByDate = { ...get().tasksByDate };
    const tastId = notifyLoading();

    try {
      await db.tracks
        .where("date")
        .between(
          midnightUTC(startDate),
          midnightUTC(get().endDate),
          true,
          false
        )
        .each((track) => {
          const dateString = track.date.toLocaleDateString();
          (tasksByDate[dateString] ??= new Set()).add(track.taskId);
        });

      // console.log(await timeoutPromise(2000));

      set(() => ({ tasksByDate, startDate }));

      toast.dismiss(tastId);
    } catch (error) {
      console.error("Error loading more tracks:", error);
      toast.dismiss(tastId);
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
      console.error("Error checking tracks:", error);
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
      console.error("Error checking tracks:", error);
      notifyDeleteError();
    }
  },

  clearHistory: async () => {
    try {
      get().destroyTracks();
      await db.tracks.clear();
    } catch (error) {
      console.error("Error cleaning history:", error);
      throw error;
    }
  },
  reset: async () => {
    try {
      await db.tables.forEach((table) => table.clear());

      get().destroyTracks();
      useTaskStore.getState().destroyTasks();
      useGroupStore.getState().destroyGroups();
    } catch (error) {
      console.error("Error reseting:", error);
      notifyDeleteError();
    }
  },
  start: async (groups: Group[], tasks: Task[], tracks?: Track[]) => {
    try {
      await db.tables.forEach((table) => table.clear());
      await db.groups.bulkAdd(Array.from(groups));
      await db.tasks.bulkAdd(Array.from(tasks));
      if (tracks) await db.tracks.bulkAdd(tracks);
    } catch (error) {
      console.error("Error starting:", error);
      throw error;
    }
  },
}));
