import Dexie, { EntityTable, Table } from "dexie";
import { Group, Task, Track } from "./types";

export interface DataDBType extends Dexie {
  groups: EntityTable<Group, "id">;
  tasks: EntityTable<Task, "id">;
  tracks: Table<Track, [string, Date]>;
}

const schema = {
  groups: "id, name, &order",
  tasks: "id, name, groupId, order",
  tracks: "[taskId+date], taskId, date",
};

const dbName = process.env.NEXT_PUBLIC_DB_NAME || "DataDB";

export const db = new Dexie(dbName) as DataDBType;

db.version(1).stores(schema);
