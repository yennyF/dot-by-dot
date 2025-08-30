import { midnightUTCstring } from "../util";

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

export type ApiTask = {
  id: string;
  name: string;
  group_id: string | null;
  order: string;
};

export type TaskLog = {
  taskId: string;
  date: Date;
};

export type ApiTaskLog = {
  task_id: string;
  date: string; // Format: "M/D/YYYY"
};

export function toTaskArray(data: ApiTask[]): Task[] {
  return data.map((t) => toTask(t));
}

export function toApiTaskArray(tasks: Task[]): ApiTask[] {
  return tasks.map((t) => toApiTask(t));
}

export function toTask(data: ApiTask): Task {
  return {
    id: data.id,
    groupId: data.group_id || undefined,
    name: data.name,
    order: data.order,
  };
}

export function toApiTask(task: Task): ApiTask {
  return {
    id: task.id,
    group_id: task.groupId || null,
    name: task.name,
    order: task.order,
  };
}

export function toTaskLogArray(data: ApiTaskLog[]): TaskLog[] {
  return data.map((t) => toTaskLog(t));
}

export function toApiTaskLogArray(taskLog: TaskLog[]): ApiTaskLog[] {
  return taskLog.map((t) => toApiTaskLog(t));
}

export function toTaskLog(data: ApiTaskLog): TaskLog {
  return {
    date: new Date(data.date),
    taskId: data.task_id,
  };
}

export function toApiTaskLog(taskLog: TaskLog): ApiTaskLog {
  return {
    date: midnightUTCstring(taskLog.date),
    task_id: taskLog.taskId,
  };
}
