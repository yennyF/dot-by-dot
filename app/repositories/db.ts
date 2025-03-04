import Dexie, { EntityTable } from "dexie";
import { Habit, Track, HabitTrack } from "./types";
import { eachDayOfInterval } from "date-fns";
import { subMonths } from "date-fns";
import { subDays } from "date-fns";

const dbVersion = 1;

export class TickedDB extends Dexie {
  habits!: EntityTable<Habit, "id">;
  tracks!: EntityTable<Track, "id">;
  habit_track!: EntityTable<HabitTrack>;

  constructor() {
    super("TickedDB");
    this.version(dbVersion).stores({
      habits: "++id, &name",
      tracks: "++id, &date",
      habit_track: "[habitId+trackId], habitId, trackId",
    });
  }

  async initialize() {
    try {
      // This will throw if database doesn't exist
      await this.open();
      console.log("Database opened successfully");

      // Check if tables are empty
      const habitCount = await this.habits.count();
      const trackCount = await this.tracks.count();
      const habitTrackCount = await this.habit_track.count();

      // Optional: Initialize with default data if empty
      if (habitCount === 0) {
        await this.initializeDefaultData();
      }

      console.log(
        `Database contains: ${habitCount} habits, ${trackCount} tracks, ${habitTrackCount} habit_track`
      );

      return true;
    } catch (error) {
      console.error("Database initialization failed:", error);
      return false;
    }
  }

  private async initializeDefaultData() {
    console.log("Initializing default data...");

    // Add some default habits
    const habitNames = [
      "React",
      "LeetCode",
      "Behavioral",
      "English",
      "My Project",
      "Workout",
    ];
    await this.habits.bulkAdd(
      habitNames.map((name) => ({ name })),
      { allKeys: true }
    );

    // Add some default tracks
    const currentDate = new Date();
    const totalDays = eachDayOfInterval({
      start: subMonths(currentDate, 1),
      end: subDays(currentDate, 1),
    });
    await this.tracks.bulkAdd(
      totalDays.map((date) => ({ date: date.toLocaleDateString() })),
      { allKeys: true }
    );

    // Add some default habit tracks
    const habits = await this.habits.toArray();
    const tracks = await this.tracks.toArray();
    for (const track of tracks) {
      const habitTracks = habits.reduce((acc, habit) => {
        if (Math.random() > 0.7) {
          acc.push({ habitId: habit.id, trackId: track.id });
        }
        return acc;
      }, [] as HabitTrack[]);
      await this.habit_track.bulkAdd(habitTracks, { allKeys: true });
    }

    console.log("Default data initialized");
  }
}

export const db = new TickedDB();

db.initialize().then((success) => {
  if (success) {
    console.log("Database ready to use");
  } else {
    console.error("Failed to initialize database");
  }
});
