export type LocaleDateString = string; // Format: "M/D/YYYY"

export type Task = {
  id: number;
  name: string;
};

export type Track = {
  taskId: number;
  date: Date;
};
