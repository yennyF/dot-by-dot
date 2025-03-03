import Dexie, { EntityTable } from "dexie";
// import { seed } from "./seed";

export interface Habit {
  id: number;
  name: string;
}

export interface Track {
  id: number;
  date: string;
}

export interface HabitTrack {
  habitId: number;
  trackId: number;
}

const dbVersion = 1;

export const db = new Dexie("TickedDB") as Dexie & {
  habits: EntityTable<Habit, "id">;
  tracks: EntityTable<Track, "id">;
  habit_track: EntityTable<HabitTrack>;
};

db.version(dbVersion).stores({
  habits: "++id, &name",
  tracks: "++id, &date",
  habit_track: "[habitId+trackId], habitId, trackId",
});

// await db.delete();

// await seed();
