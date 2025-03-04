import { db } from "./db";
import { Habit } from "./types";

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
