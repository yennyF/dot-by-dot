import { db } from "./db";
import { LocaleDateString, Track } from "./types";

export async function getTracks(): Promise<Track[]> {
  return await db.tracks.toArray();
}

export async function getTasksByDate(date: Date): Promise<Set<number>> {
  const tracks = await db.tracks.where("date").equals(date).toArray();
  const taskIds = tracks.map((track) => track.taskId);
  return new Set(taskIds);
}

export async function getDatesByTask(
  taskId: number
): Promise<Set<LocaleDateString>> {
  const tracks = await db.tracks.where("taskId").equals(taskId).toArray();
  const dates = tracks.map((track) => track.date.toLocaleDateString());
  return new Set(dates);
}

export async function setTaskByDate(
  taskId: number,
  isChecked: boolean,
  date: Date
) {
  const task = await db.tasks.get(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  if (isChecked) {
    await db.tracks.add({ taskId, date });
  } else {
    await db.tracks.where(["taskId", "date"]).equals([taskId, date]).delete();
  }
}
