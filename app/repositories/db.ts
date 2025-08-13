import Dexie, { EntityTable, Table } from "dexie";
import { Group, Task, Track } from "./types";

type DataDBType = Dexie & {
  groups: EntityTable<Group, "id">;
  tasks: EntityTable<Task, "id">;
  tracks: Table<Track, [string, Date]>;
};

const schema = {
  groups: "id, name, &order",
  tasks: "id, name, groupId, order",
  tracks: "[taskId+date], taskId, date",
};

export const db = new Dexie("DataDB") as DataDBType;
export const mockDB = new Dexie("MockDataDB") as DataDBType;

db.version(1).stores(schema);
mockDB.version(1).stores(schema);
