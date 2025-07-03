export type LocaleDateString = string; // Format: "M/D/YYYY"

export type Group = {
  id: string;
  name: string;
};

export type Task = {
  id: string;
  name: string;
  groupId?: string;
};

export type Track = {
  taskId: string;
  date: Date;
};

export function normalizeDateUTC(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}
