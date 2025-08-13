import { create } from "zustand";
import { Group, Task, Track } from "../repositories/types";
import { notifyDeleteError } from "../components/Notification";
import { useTaskStore } from "./TaskStore";
import { useGroupStore } from "./GroupStore";
import { useTrackStore } from "./TrackStore";
import { getDatabase } from "../repositories/db";
import {
  genGroupedTasks,
  genTracks,
  genUngroupedTasks,
} from "../repositories/data";

type State = {
  testMode: boolean;
};

type Action = {
  init: () => Promise<void>;
  reset: () => Promise<void>;
  start: (groups: Group[], tasks: Task[], tracks?: Track[]) => Promise<void>;
  startMock: () => Promise<void>;
  setTestMode: (testMode: boolean) => void;
};

export const useAppStore = create<State & Action>((set, get) => ({
  testMode: false,
  setTestMode: (testMode: boolean) => {
    set(() => ({ testMode }));
  },

  init: async () => {
    try {
      await Promise.all([
        useGroupStore.getState().initGroups(),
        useTaskStore.getState().initTasks(),
        useTrackStore.getState().initTracks(),
      ]);
    } catch (error) {
      console.log("Error initializing", error);
      throw error;
    }
  },
  reset: async () => {
    try {
      const db = getDatabase();
      await db.tables.forEach((table) => table.clear());

      useTrackStore.getState().destroyTracks();
      useTaskStore.getState().destroyTasks();
      useGroupStore.getState().destroyGroups();
    } catch (error) {
      console.error("Error reseting:", error);
      notifyDeleteError();
    }
  },

  start: async (groups: Group[], tasks: Task[], tracks?: Track[]) => {
    try {
      const db = getDatabase();
      await db.tables.forEach((table) => table.clear());
      await db.groups.bulkAdd(Array.from(groups));
      await db.tasks.bulkAdd(Array.from(tasks));
      if (tracks) await db.tracks.bulkAdd(tracks);
    } catch (error) {
      console.error("Error starting:", error);
      throw error;
    }
  },
  startMock: async () => {
    const groups: Group[] = [];
    const tasks: Task[] = genUngroupedTasks();
    genGroupedTasks().forEach(([group, _tasks]) => {
      groups.push(group);
      tasks.push(..._tasks);
    });

    const tracks = genTracks(
      useTrackStore.getState().startDate,
      useTrackStore.getState().endDate,
      tasks
    );

    set(() => ({ testMode: true }));
    get().start(groups, tasks, tracks);
  },
}));
