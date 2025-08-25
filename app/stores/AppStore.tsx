import { create } from "zustand";
import { Group, Task, Track } from "../repositories/types";
import { notifyDeleteError } from "../components/Notification";
import { useTaskStore } from "./TaskStore";
import { useGroupStore } from "./GroupStore";
import { useTrackStore } from "./TrackStore";
import { db } from "../repositories/db";
import {
  genGroupedTasks,
  genTracks,
  genUngroupedTasks,
} from "../repositories/data";

type State = {
  isDataEmpty: boolean | undefined;
};

type Action = {
  init: () => Promise<void>;
  reset: () => Promise<void>;
  start: (groups: Group[], tasks: Task[], tracks?: Track[]) => Promise<void>;
  startMock: () => Promise<void>;
};

export const useAppStore = create<State & Action>((set, get) => ({
  isDataEmpty: undefined,

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

      get().init();
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

    get().start(groups, tasks, tracks);
  },
}));

useGroupStore.subscribe(
  (state) => state.groups,
  (groups) => {
    useGroupStore.setState((state) => {
      state.size = groups?.length;
    });
  }
);
useTaskStore.subscribe(
  (state) => state.tasksByGroup,
  (tasksByGroup) => {
    useTaskStore.setState((state) => {
      state.size = tasksByGroup
        ? Object.values(tasksByGroup).reduce(
            (acc, tasks) => acc + tasks.length,
            0
          )
        : undefined;
    });
  }
);
useGroupStore.subscribe(
  (state) => state.size,
  (size) => {
    useAppStore.setState(() => {
      const taskSize = useTaskStore.getState().size;
      if (size === undefined || taskSize === undefined) {
        return { isDataEmpty: undefined };
      }
      return { isDataEmpty: size === 0 && taskSize === 0 };
    });
  }
);
// useTaskStore.subscribe(
//   (state) => state.size,
//   (size) => {
//     useAppStore.setState(() => {
//       const groupSize = useGroupStore.getState().size;
//       if (size === undefined || groupSize === undefined) {
//         return { isDataEmpty: undefined };
//       }
//       return { isDataEmpty: size === 0 && groupSize === 0 };
//     });
//   }
// );
