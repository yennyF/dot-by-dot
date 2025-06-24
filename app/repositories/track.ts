import { db } from "./db";
import { LocaleDateString, Track } from "./types";

export async function addTrack(date: Date): Promise<Track> {
  const dateString = date.toLocaleDateString();
  const id = await db.tracks.add({ id: dateString });
  return { id };
}

export async function getTracks(): Promise<Track[]> {
  return await db.tracks.toArray();
}

export async function getTasksByDate(
  trackId: LocaleDateString
): Promise<Set<number>> {
  const habitTracks = await db.task_track
    .where("trackId")
    .equals(trackId)
    .toArray();
  const taskIds = habitTracks.map((habitTrack) => habitTrack.taskId);
  return new Set(taskIds);
}

export async function getDatesByTask(
  taskId: number
): Promise<Set<LocaleDateString>> {
  const habitTracks = await db.task_track
    .where("taskId")
    .equals(taskId)
    .toArray();
  const trackIds = habitTracks.map((habitTrack) => habitTrack.trackId);
  return new Set(trackIds);
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

  const dateString = date.toLocaleDateString();

  let trackId = (await db.tracks.where("date").equals(dateString).first())?.id;
  if (trackId === undefined) {
    trackId = await db.tracks.add({ date: dateString });
  }

  if (isChecked) {
    await db.task_track.add({ taskId, trackId });
  } else {
    await db.task_track
      .where(["taskId", "trackId"])
      .equals([taskId, trackId])
      .delete();
  }

  return trackId;
}
