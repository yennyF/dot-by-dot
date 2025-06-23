import { create } from "zustand";
import * as Repositories from "./repositories";
import { LocaleDateString } from "./repositories";

export type DateGroup = Record<LocaleDateString, Set<number>> | undefined;
export type TaskGroup = Record<string, Set<LocaleDateString>> | undefined;

type Store = {
  habitGroup: TaskGroup;
  dateGroup: DateGroup;
  loadTaskGroup: () => Promise<void>;
  loadDateGroup: () => Promise<void>;
  setTaskChecked: (date: Date, taskId: number, checked: boolean) => void;
};

export const useStore = create<Store>((set) => ({
  habitGroup: undefined,
  dateGroup: undefined,
  loadTaskGroup: async () => {
    const habits = await Repositories.getTask();
    const entries = await Promise.all(
      habits.map(async (task) => {
        const dates = await Repositories.getDatesByTask(task.id);
        return [task.id, dates] as const;
      })
    );
    set(() => ({ habitGroup: Object.fromEntries(entries) }));
  },
  loadDateGroup: async () => {
    const tracks = await Repositories.getTracks();
    const entries = await Promise.all(
      tracks.map(async (track) => {
        const dates = await Repositories.getTasksByDate(track.id);
        return [track.date, dates] as const;
      })
    );
    set(() => ({ dateGroup: Object.fromEntries(entries) }));
  },
  setTaskChecked: (date: Date, taskId: number, checked: boolean) => {
    set((state) => {
      const dateString = date.toLocaleDateString();

      const newTaskGroup = { ...state.habitGroup };
      newTaskGroup[taskId] = new Set(state.habitGroup?.[taskId]);
      const newDateGroup = { ...state.dateGroup };
      newDateGroup[dateString] = new Set(state.dateGroup?.[dateString]);

      if (checked) {
        newTaskGroup[taskId].add(dateString);
        newDateGroup[dateString].add(taskId);
      } else {
        newTaskGroup[taskId].delete(dateString);
        newDateGroup[dateString].delete(taskId);
      }
      return {
        habitGroup: newTaskGroup,
        dateGroup: newDateGroup,
      };
    });

    try {
      Repositories.setTaskByDate(taskId, checked, date);
    } catch {
      // TODO rollback and message
    }
  },
}));
