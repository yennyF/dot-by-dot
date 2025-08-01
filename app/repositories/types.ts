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
