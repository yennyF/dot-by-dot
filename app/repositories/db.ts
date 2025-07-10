import Dexie, { EntityTable, Table } from "dexie";
import { Group, midnightUTC, Task, Track } from "./types";
import { eachDayOfInterval } from "date-fns";
import { subMonths } from "date-fns";
import { subDays } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { LexoRank } from "lexorank";

const dbVersion = 1;

export class TickedDB extends Dexie {
  groups!: EntityTable<Group, "id">;
  tasks!: EntityTable<Task, "id">;
  tracks!: Table<Track, [string, Date]>;

  constructor() {
    super("TickedDB");
    this.version(dbVersion).stores({
      groups: "id, name",
      tasks: "id, name, groupId",
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
    const groups: Group[] = [
      { id: "1", name: "Interview" },
      { id: "2", name: "Workout" },
      { id: "3", name: "Portfolio" },
    ];
    await this.groups.bulkAdd(groups, { allKeys: true });

    // Add some default tasks
    const items: Pick<Task, "name" | "groupId">[] = [
      { name: "Blah" },
      { name: "Blah Blah" },

      { name: "React", groupId: "1" },
      { name: "LeetCode", groupId: "1" },
      { name: "Behavioral", groupId: "1" },
      { name: "English", groupId: "1" },
      { name: "Mock Interview", groupId: "1" },
      { name: "System Design", groupId: "1" },
      { name: "AI", groupId: "1" },
      { name: "Tecnhology", groupId: "1" },

      { name: "Rower", groupId: "2" },
      { name: "Rotations", groupId: "2" },
      { name: "Squads", groupId: "2" },
      { name: "Skate", groupId: "2" },
      { name: "Sport Climb", groupId: "2" },
      { name: "Yoga", groupId: "2" },

      { name: "CLimb App", groupId: "3" },
      { name: "Habit App", groupId: "3" },
      { name: "Photography", groupId: "3" },
      { name: "Drawing", groupId: "3" },
    ];
    let lexoRank = LexoRank.middle();
    const tasks: Task[] = items.map((item) => {
      const prev = lexoRank;
      lexoRank = lexoRank.genNext();
      return { id: uuidv4(), order: prev.toString(), ...item };
    });
    const taskIds = await this.tasks.bulkAdd(tasks, { allKeys: true });

    // Add some default tracks
    const currentDate = new Date();
    const totalDays = eachDayOfInterval({
      start: subMonths(currentDate, 1),
      end: subDays(currentDate, 1),
    });
    for (const date of totalDays) {
      const tracks = taskIds.reduce<Track[]>((acc, taskId) => {
        if (Math.random() > 0.7) {
          acc.push({ taskId, date: midnightUTC(date) });
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
