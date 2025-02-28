import { eachDayOfInterval, subDays, subMonths } from "date-fns";
import { db, Habit } from "./db";

// Habit

export async function initHabits() {
  const habits = [
    "React",
    "LeetCode",
    "Behavioral",
    "English",
    "My Project",
    "Workout",
  ];

  for (const habit of habits) {
    try {
      await addHabit(habit);
    } catch (error) {
      console.error(error);
    }
  }

  return habits;
}

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

// HabitTrack

export async function initTrack() {
  let habits: Habit[] = [];
  try {
    habits = await db.habits.toArray();
  } catch (error) {
    console.error("Error getting habits:", error);
    return;
  }

  const currentDate = new Date();
  const totalDays = eachDayOfInterval({
    start: subMonths(currentDate, 1),
    end: subDays(currentDate, 1),
  });

  for (const date of totalDays) {
    try {
      const trackId = await addTrack(date);
      for (const habit of habits) {
        if (Math.random() > 0.7) {
          try {
            await addHabitTrack(habit.id, trackId);
          } catch (error) {
            console.error("Error adding habit track:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error adding track:", error);
    }
  }
}

export async function addTrack(date: Date) {
  const id = await db.tracks.add({ date });
  return { id, date };
}

// HabitTrack

export async function addHabitTrack(habitId: number, trackId: number) {
  const id = await db.habit_track.add({ habitId, trackId });
  return { id, habitId, trackId };
}

export async function deleteHabitTrack(habitId: number, trackId: number) { }

// HabitHistory

export type HabitHistoryType = Record<
  string,
  {
    id: number;
    trackId: number;
    habits: Record<string, boolean>;
  }
>;

export async function getHabitHistory(): Promise<HabitHistoryType> {
  const tracks = await db.tracks.toArray();

  const habitHistory: HabitHistoryType = {};

  for (const track of tracks) {
    habitHistory[track.date.toDateString()] = {
      id: track.id,
      trackId: track.id,
      habits: {},
    };

    const habitTracks = await db.habit_track
      .where("trackId")
      .equals(track.id)
      .toArray();

    for (const habitTrack of habitTracks) {
      habitHistory[track.date.toDateString()].habits[habitTrack.habitId] = true;
    }
  }

  return habitHistory;
}
