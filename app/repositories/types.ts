export type LocaleDateString = string; // Format: "M/D/YYYY"

export type Task = {
  id: number;
  name: string;
};

export type Track = {
  id: number;
  date: LocaleDateString;
};

export type TaskTrack = {
  taskId: number;
  trackId: number;
};
