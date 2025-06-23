import Dexie, { EntityTable } from "dexie";
import { Task, Track, TaskTrack } from "./types";
import { eachDayOfInterval } from "date-fns";
import { subMonths } from "date-fns";
import { subDays } from "date-fns";

const dbVersion = 1;

export class TickedDB extends Dexie {
  tasks!: EntityTable<Task, "id">;
  tracks!: EntityTable<Track, "id">;
  task_track!: EntityTable<TaskTrack>;

  constructor() {
    super("TickedDB");
    this.version(dbVersion).stores({
      tasks: "++id, &name",
      tracks: "++id, &date",
      task_track: "[taskId+trackId], taskId, trackId",
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
      const taskTrackCount = await this.task_track.count();

      // Optional: Initialize with default data if empty
      if (taskCount === 0) {
        await this.initializeDefaultData();
      }

      console.log(
        `Database contains: ${taskCount} tasks, ${trackCount} tracks, ${taskTrackCount} task_track`
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
    await this.tasks.bulkAdd(
      taskNames.map((name) => ({ name })),
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

    // Add some default task tracks
    const tasks = await this.tasks.toArray();
    const tracks = await this.tracks.toArray();
    for (const track of tracks) {
      const taskTracks = tasks.reduce((acc, task) => {
        if (Math.random() > 0.7) {
          acc.push({ taskId: task.id, trackId: track.id });
        }
        return acc;
      }, [] as TaskTrack[]);
      await this.task_track.bulkAdd(taskTracks, { allKeys: true });
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
