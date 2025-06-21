export type LocaleDateString = string; // Format: "M/D/YYYY"

export type Habit = {
  id: number;
  name: string;
};

export type Track = {
  id: number;
  date: LocaleDateString;
};

export type HabitTrack = {
  habitId: number;
  trackId: number;
};
