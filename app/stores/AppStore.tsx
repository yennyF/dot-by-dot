import { create } from "zustand";
import { Group, Task, Track } from "../repositories/types";
import { db } from "../repositories/db";
import { notifyDeleteError } from "../components/Notification";
import { useTaskStore } from "./TaskStore";
import { useGroupStore } from "./GroupStore";
import { useTrackStore } from "./TrackStore";

type State = {};

type Action = {
  init: () => Promise<void>;
  reset: () => Promise<void>;
  start: (groups: Group[], tasks: Task[], tracks?: Track[]) => Promise<void>;
};

export const useAppStore = create<State & Action>(() => ({
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
