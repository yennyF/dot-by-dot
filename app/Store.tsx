import { create } from "zustand";
import * as Repositories from "./repositories";
import { LocaleDateString } from "./repositories";

export type DateGroup = Record<LocaleDateString, Set<number>> | undefined;
export type HabitGroup = Record<string, Set<LocaleDateString>> | undefined;

type Store = {
  habitGroup: HabitGroup;
  dateGroup: DateGroup;
  loadHabitGroup: () => Promise<void>;
  loadDateGroup: () => Promise<void>;
  setHabitChecked: (date: Date, habitId: number, checked: boolean) => void;
};

export const useStore = create<Store>((set) => ({
  habitGroup: undefined,
  dateGroup: undefined,
  loadHabitGroup: async () => {
    const habits = await Repositories.getHabit();
    const entries = await Promise.all(
      habits.map(async (habit) => {
        const dates = await Repositories.getDatesByHabit(habit.id);
        return [habit.id, dates] as const;
      })
    );
    set(() => ({ habitGroup: Object.fromEntries(entries) }));
  },
  loadDateGroup: async () => {
    const tracks = await Repositories.getTracks();
    const entries = await Promise.all(
      tracks.map(async (track) => {
        const dates = await Repositories.getHabitsByDate(track.id);
        return [track.date, dates] as const;
      })
    );
    set(() => ({ dateGroup: Object.fromEntries(entries) }));
  },
  setHabitChecked: (date: Date, habitId: number, checked: boolean) => {
    set((state) => {
      const dateString = date.toLocaleDateString();

      const newHabitGroup = { ...state.habitGroup };
      newHabitGroup[habitId] = new Set(state.habitGroup?.[habitId]);
      const newDateGroup = { ...state.dateGroup };
      newDateGroup[dateString] = new Set(state.dateGroup?.[dateString]);

      if (checked) {
        newHabitGroup[habitId].add(dateString);
        newDateGroup[dateString].add(habitId);
      } else {
        newHabitGroup[habitId].delete(dateString);
        newDateGroup[dateString].delete(habitId);
      }
      return {
        habitGroup: newHabitGroup,
        dateGroup: newDateGroup,
      };
    });

    try {
      Repositories.setHabitByDate(habitId, checked, date);
    } catch {
      // TODO rollback and message
    }
  },
}));
