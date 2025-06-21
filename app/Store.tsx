import { create } from "zustand";
import * as Repositories from "./repositories";
import { LocaleDateString } from "./repositories";

export type DateGroup = Record<LocaleDateString, Set<number>>;
export type HabitGroup = Record<string, Set<LocaleDateString>>;

type Store = {
  habitGroup: HabitGroup;
  dateGroup: DateGroup;
  loadHabitGroup: () => Promise<void>;
  loadDateGroup: () => Promise<void>;
  toggleHabit: (date: Date, habitId: number) => void;
};

export const useStore = create<Store>((set) => ({
  habitGroup: {},
  dateGroup: {},
  loadHabitGroup: async () => {
    const habits = await Repositories.getHabit();
    habits.forEach(async (habit) => {
      const dates = await Repositories.getDatesByHabit(habit.id);
      set((state) => ({
        habitGroup: {
          ...state.habitGroup,
          [habit.id]: dates,
        },
      }));
    });
  },
  loadDateGroup: async () => {
    const tracks = await Repositories.getTracks();
    tracks.forEach(async (track) => {
      const dataSet = await Repositories.getHabitsByDate(track.id);
      set((state) => ({
        dateGroup: {
          ...state.dateGroup,
          [track.date]: dataSet,
        },
      }));
    });
  },
  toggleHabit: (date: Date, habitId: number) =>
    set((state) => {
      const dateString = date.toLocaleDateString();
      const checked = state.habitGroup[habitId]?.has(dateString) ?? false;
      const nextChecked = !checked;

      const newHabitGroup = { ...state.habitGroup };
      newHabitGroup[habitId] = new Set(state.habitGroup[habitId]);

      const newDateGroup = { ...state.dateGroup };
      newDateGroup[dateString] = new Set(state.dateGroup[dateString]);

      if (nextChecked) {
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
    }),
}));
