import { db } from "./db";
import { Group } from "./types";

export async function getGroups(): Promise<Group[]> {
  return await db.groups.toArray();
}

export async function addGroup(name: string): Promise<Group> {
  const id = await db.groups.add({ name });
  return { id, name };
}

export async function updateGroup(id: number, name: string): Promise<Group> {
  await db.groups.update(id, { name });
  return { id, name };
}

export async function deleteGroup(id: number) {
  await db.groups.delete(id);
}
