export type LocaleDateString = string; // Format: "M/D/YYYY"

export type Task = {
  id: number;
  name: string;
};

export type Track = {
  id: LocaleDateString;
};

export type TaskTrack = {
  taskId: number;
  trackId: LocaleDateString;
};
