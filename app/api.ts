import { db, Habit, Track } from "./db";

// Habit

export async function getHabit(): Promise<Habit[]> {
  return await db.habits.toArray();
}

export async function addHabit(name: string): Promise<Habit> {
  const id = await db.habits.add({ name });
  return { id, name };
}

export async function updateHabit(id: number, name: string): Promise<Habit> {
  await db.habits.update(id, { name });
  return { id, name };
}

export async function deleteHabit(id: number) {
  await db.habits.delete(id);
}

// Track

export async function addTrack(date: Date): Promise<Track> {
  const dateString = date.toLocaleDateString();
  const id = await db.tracks.add({ date: dateString });
  return { id, date: dateString };
}

// HabitTrack

export type GroupedHabitTrack = Record<
  string,
  {
    trackId: number;
    habits: Record<string, boolean>;
  }
>;

export async function getHabitTrack(): Promise<GroupedHabitTrack> {
  const groupedHabitTrack: GroupedHabitTrack = {};
  const tracks = await db.tracks.toArray();

  await Promise.all(
    tracks.map(async (track) => {
      const habitTracks = await db.habit_track
        .where("trackId")
        .equals(track.id)
        .toArray();

      const habits: Record<string, boolean> = {};
      habitTracks.forEach((habitTrack) => {
        habits[habitTrack.habitId] = true;
      });

      groupedHabitTrack[track.date] = {
        trackId: track.id,
        habits,
      };
    })
  );

  return groupedHabitTrack;
}

export async function addHabitTrack(habitId: number, trackId: number) {
  const habitTrack = await db.habit_track.get([habitId, trackId]);
  if (!habitTrack) {
    await db.habit_track.add({ habitId, trackId });
  }
  return { habitId, trackId };
}

export async function deleteHabitTrack(trackId: number, habitId: number) {
  await db.habit_track
    .where(["habitId", "trackId"])
    .equals([habitId, trackId])
    .delete();
}
