import Dexie, { EntityTable, Table } from "dexie";
import { Group, Task, Track } from "./types";

const dbVersion = 1;

export class TickedDB extends Dexie {
  groups!: EntityTable<Group, "id">;
  tasks!: EntityTable<Task, "id">;
  tracks!: Table<Track, [string, Date]>;

  constructor() {
    super("TickedDB");
    this.version(dbVersion).stores({
      groups: "id, name, &order",
      tasks: "id, name, groupId, order",
      tracks: "[taskId+date], taskId, date",
    });
  }
}

export const db = new TickedDB();
