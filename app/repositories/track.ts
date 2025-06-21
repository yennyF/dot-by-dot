import { db } from "./db";
import { LocaleDateString, Track } from "./types";

export async function addTrack(date: Date): Promise<Track> {
  const dateString = date.toLocaleDateString();
  const id = await db.tracks.add({ date: dateString });
  return { id, date: dateString };
}

export async function getTracks(): Promise<Track[]> {
  return await db.tracks.toArray();
}

export async function getHabitsByDate(trackId: number): Promise<Set<number>> {
  const habitTracks = await db.habit_track
    .where("trackId")
    .equals(trackId)
    .toArray();
  const habitIds = habitTracks.map((habitTrack) => habitTrack.habitId);
  // const habits = await db.habits.where("id").anyOf(habitIds).toArray();

  // return new Set(habits.map((habit) => habit.name));
  return new Set(habitIds);
}

export async function getDatesByHabit(
  habitId: number
): Promise<Set<LocaleDateString>> {
  const habitTracks = await db.habit_track
    .where("habitId")
    .equals(habitId)
    .toArray();
  const trackIds = habitTracks.map((habitTrack) => habitTrack.trackId);
  const tracks = await db.tracks.where("id").anyOf(trackIds).toArray();

  return new Set(tracks.map((track) => track.date));
}

export async function setHabitByDate(
  habitId: number,
  isChecked: boolean,
  date: Date
) {
  const habit = await db.habits.get(habitId);
  if (!habit) {
    throw new Error("Habit not found");
  }

  const dateString = date.toLocaleDateString();

  let trackId = (await db.tracks.where("date").equals(dateString).first())?.id;
  if (trackId === undefined) {
    trackId = await db.tracks.add({ date: dateString });
  }

  if (isChecked) {
    await db.habit_track.add({ habitId, trackId });
  } else {
    await db.habit_track
      .where(["habitId", "trackId"])
      .equals([habitId, trackId])
      .delete();
  }

  return trackId;
}
