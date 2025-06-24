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
  const normalizedDate = normalizeDateUTC(date);
  let track = await db.tracks
    .where(["taskId", "date"])
    .equals([taskId, normalizedDate])
    ?.first();
  if (!track) {
    const id = await db.tracks.add({ taskId, date: normalizedDate });
    track = { id, taskId, date: normalizedDate };
  }
  return track;
}

export async function deleteTrack(taskId: number, date: Date) {
  await db.tracks
    .where(["taskId", "date"])
    .equals([taskId, normalizeDateUTC(date)])
    .delete();
}
