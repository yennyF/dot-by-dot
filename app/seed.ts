import { eachDayOfInterval, subMonths, subDays } from "date-fns";
import { db } from "./db";

export async function seed() {
  await seedHabits();
  await seedTracks();
}

async function seedHabits() {
  const names = [
    "React",
    "LeetCode",
    "Behavioral",
    "English",
    "My Project",
    "Workout",
  ];

  for (const name of names) {
    try {
      await db.habits.add({ name });
    } catch (error) {
      console.error(error);
    }
  }
}

async function seedTracks() {
  const habits = await db.habits.toArray();

  const currentDate = new Date();
  const totalDays = eachDayOfInterval({
    start: subMonths(currentDate, 1),
    end: subDays(currentDate, 1),
  });

  for (const date of totalDays) {
    try {
      const trackId = await db.tracks.add({ date: date.toLocaleDateString() });
      for (const habit of habits) {
        if (Math.random() > 0.7) {
          try {
            await db.habit_track.add({ habitId: habit.id, trackId: trackId });
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
