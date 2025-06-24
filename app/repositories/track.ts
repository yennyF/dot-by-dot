import { db } from "./db";
import { LocaleDateString, normalizeDateUTC, Track } from "./types";

export async function getTracks(): Promise<Track[]> {
  return await db.tracks.toArray();
}

export async function getTasksByDate(date: Date): Promise<Set<number>> {
  const tracks = await db.tracks
    .where("date")
    .equals(normalizeDateUTC(date))
    .toArray();
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

export async function addTrack(taskId: number, date: Date): Promise<Track> {
  date = normalizeDateUTC(date);
  let track = await db.tracks.get([taskId, date]);
  if (!track) {
    await db.tracks.add({ taskId, date });
    track = { taskId, date };
  }
  return track;
}

export async function deleteTrack(taskId: number, date: Date) {
  await db.tracks.delete([taskId, date]);
}
