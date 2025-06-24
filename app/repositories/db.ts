import Dexie, { EntityTable, Table } from "dexie";
import { Group, normalizeDateUTC, Task, Track } from "./types";
import { eachDayOfInterval } from "date-fns";
import { subMonths } from "date-fns";
import { subDays } from "date-fns";

const dbVersion = 1;

export class TickedDB extends Dexie {
  groups!: EntityTable<Group, "id">;
  tasks!: EntityTable<Task, "id">;
  tracks!: Table<Track, [number, Date]>;

  constructor() {
    super("TickedDB");
    this.version(dbVersion).stores({
      groups: "++id, name",
      tasks: "++id, name, groupId",
      tracks: "[taskId+date], taskId, date",
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
    const groups = [
      { id: 1, name: "Interview" },
      { id: 2, name: "Workout" },
    ];
    await this.groups.bulkAdd(groups, { allKeys: true });

    // Add some default tasks
    const tasks = [
      { id: 1, name: "React", groupId: 1 },
      { id: 2, name: "LeetCode", groupId: 1 },
      { id: 3, name: "Behavioral", groupId: 1 },
      { id: 4, name: "English", groupId: 1 },
      { id: 5, name: "My Project", groupId: 1 },
      { id: 6, name: "Rower", groupId: 2 },
      { id: 7, name: "Rotation", groupId: 2 },
    ];
    await this.tasks.bulkAdd(tasks, { allKeys: true });

    // Add some default tracks
    const currentDate = new Date();
    const totalDays = eachDayOfInterval({
      start: subMonths(currentDate, 1),
      end: subDays(currentDate, 1),
    });
    for (const date of totalDays) {
      const tracks = tasks.reduce<Track[]>((acc, task) => {
        if (Math.random() > 0.7) {
          acc.push({ taskId: task.id, date: normalizeDateUTC(date) });
        }
        return acc;
      }, []);
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
