import { db, Habit, Track } from "./db";

// Habit

export async function getHabit() {
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

  await db.tracks.each(async (track) => {
    if (!track.id) return;

    const habits: Record<string, boolean> = {};
    const habitTracks = await db.habit_track.where({ trackId: track.id });
    await habitTracks.each((habitTrack) => {
      habits[habitTrack.habitId] = true;
    });

    groupedHabitTrack[track.date] = {
      trackId: track.id,
      habits,
    };
  });

  return groupedHabitTrack;
}

export async function addHabitTrack(habitId: number, trackId: number) {
  await db.habit_track.add({ habitId, trackId });
  return { habitId, trackId };
}

export async function deleteHabitTrack(trackId: number, habitId: number) {
  await db.habit_track.where({ habitId, trackId }).delete();
}
