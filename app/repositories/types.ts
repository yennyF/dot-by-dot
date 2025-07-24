export type LocaleDateString = string; // Format: "M/D/YYYY"

export type Group = {
  id: string;
  name: string;
  order: string;
};

export type Task = {
  id: string;
  name: string;
  groupId?: string;
  order: string;
};

export type Track = {
  taskId: string;
  date: Date;
};

export function midnightUTC(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export function midnightUTCstring(date: Date): string {
  return midnightUTC(date).toLocaleDateString();
}

export const timeoutPromise = (duration: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data loaded successfully");
    }, duration);
  });
};
