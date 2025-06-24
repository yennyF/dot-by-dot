export type LocaleDateString = string; // Format: "M/D/YYYY"

export type Group = {
  id: number;
  name: string;
};

export type Task = {
  id: number;
  name: string;
  groupId?: number;
};

export type Track = {
  taskId: number;
  date: Date;
};

export function normalizeDateUTC(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}
