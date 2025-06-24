import Dexie, { EntityTable, InsertType } from "dexie";
import { normalizeDateUTC, Task, Track } from "./types";
import { eachDayOfInterval } from "date-fns";
import { subMonths } from "date-fns";
import { subDays } from "date-fns";

const dbVersion = 1;

export class TickedDB extends Dexie {
  tasks!: EntityTable<Task, "id">;
  tracks!: EntityTable<Track, "id">;

  constructor() {
    super("TickedDB");
    this.version(dbVersion).stores({
      tasks: "++id, &name",
      tracks: "++id, [taskId+date]&, taskId, date",
    });
  }

  async initialize() {
    try {
      // This will throw if database doesn't exist
      await this.open();
      console.log("Database opened successfully");

      // Check if tables are empty
      const taskCount = await this.tasks.count();
      const trackCount = await this.tracks.count();

      // Optional: Initialize with default data if empty
      if (taskCount === 0) {
        await this.initializeDefaultData();
      }

      console.log(
        `Database contains: ${taskCount} tasks, ${trackCount} tracks`
      );

      return true;
    } catch (error) {
      console.error("Database initialization failed:", error);
      return false;
    }
  }

  private async initializeDefaultData() {
    console.log("Initializing default data...");

    // Add some default tasks
    const taskNames = [
      "React",
      "LeetCode",
      "Behavioral",
      "English",
      "My Project",
      "Workout",
    ];
    const taskIds = await this.tasks.bulkAdd(
      taskNames.map((name) => ({ name }) as Task),
      { allKeys: true }
    );

    // Add some default tracks
    const currentDate = new Date();
    const totalDays = eachDayOfInterval({
      start: subMonths(currentDate, 1),
      end: subDays(currentDate, 1),
    });
    for (const date of totalDays) {
      const tracks = taskIds.reduce<InsertType<Track, "id">[]>(
        (acc, taskId) => {
          if (Math.random() > 0.7) {
            acc.push({ taskId, date: normalizeDateUTC(date) });
          }
          return acc;
        },
        []
      );
      await this.tracks.bulkAdd(tracks, { allKeys: true });
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
