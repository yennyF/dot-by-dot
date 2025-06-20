import { db } from "./db";
import { Habit, HabitsByDate, HabitsByDate2, Track } from "./types";

export async function addTrack(date: Date): Promise<Track> {
  const dateString = date.toLocaleDateString();
  const id = await db.tracks.add({ date: dateString });
  return { id, date: dateString };
}

export async function getHabitsByDate(): Promise<HabitsByDate> {
  const habitsByDate: HabitsByDate = {};
  const tracks = await db.tracks.toArray();

  await Promise.all(
    tracks.map(async (track) => {
      habitsByDate[track.date] = {};

      const habitTracks = await db.habit_track
        .where("trackId")
        .equals(track.id)
        .toArray();
      habitTracks.forEach((habitTrack) => {
        habitsByDate[track.date][habitTrack.habitId] = true;
      });
    })
  );

  return habitsByDate;
}

export async function getHabitsByDate2(
  habitId: number
): Promise<HabitsByDate2> {
  const habitsByDate2: HabitsByDate2 = {};

  const habitTracks = await db.habit_track
    .where("habitId")
    .equals(habitId)
    .toArray();

  const trackIds = habitTracks.map((habitTrack) => habitTrack.trackId);
  const tracks = await db.tracks.where("id").anyOf(trackIds).toArray();

  tracks.forEach((track) => {
    habitsByDate2[track.date] = true;
  });
  return habitsByDate2;
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
