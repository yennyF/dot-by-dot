export type LocaleDateString = string; // Format: "M/D/YYYY"
export type HabitString = string;

export type Habit = {
  id: number;
  name: HabitString;
};

export type Track = {
  id: number;
  date: LocaleDateString;
};

export type HabitTrack = {
  habitId: number;
  trackId: number;
};

export type HabitsByDate = Record<
  LocaleDateString,
  Record<HabitString, boolean>
>;
