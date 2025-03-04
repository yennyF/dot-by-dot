import Dexie, { EntityTable } from "dexie";
import { Habit, Track, HabitTrack } from "./types";
// import { seed } from "./seed";

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
