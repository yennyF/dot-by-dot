import Dexie, { EntityTable, Table } from "dexie";
import { Group, Task, Track } from "./types";

export const db = new Dexie("TickedDB") as Dexie & {
  groups: EntityTable<Group, "id">;
  tasks: EntityTable<Task, "id">;
  tracks: Table<Track, [string, Date]>;
};

db.version(1).stores({
  groups: "id, name, &order",
  tasks: "id, name, groupId, order",
  tracks: "[taskId+date], taskId, date",
});
