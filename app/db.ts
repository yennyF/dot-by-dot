import Dexie, { type EntityTable } from "dexie";

const dbVersion = 1;

interface Habit {
  id: number;
  name: string;
}

interface Track {
  id: number;
  date: Date;
}

interface HabitTrack {
  id: number;
  habitId: number;
  trackId: number;
}

const db = new Dexie("TickedDB") as Dexie & {
  habits: EntityTable<Habit, "id">;
  tracks: EntityTable<Track, "id">;
  habit_track: EntityTable<HabitTrack, "id">;
};

// await db.delete();

db.version(dbVersion).stores({
  habits: "++id, &name",
  tracks: "++id, date",
  habit_track: "++id, habitId, trackId",
});

export type { Habit, Track, HabitTrack };
export { db };
