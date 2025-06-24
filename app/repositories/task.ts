import { db } from "./db";
import { Task } from "./types";

export async function getTasks(): Promise<Task[]> {
  return await db.tasks.toArray();
}

export async function addTask(name: string): Promise<Task> {
  const id = await db.tasks.add({ name });
  return { id, name };
}

export async function updateTask(id: number, name: string): Promise<Task> {
  await db.tasks.update(id, { name });
  return { id, name };
}

export async function deleteTask(id: number) {
  await db.tasks.delete(id);
}
