export type TaskLog = {
  taskId: string;
  date: Date;
};

export type ApiTaskLog = {
  task_id: string;
  date: string; // Format: "M/D/YYYY"
};

export function toApiDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function mapTaskLogRequest(taskLog: TaskLog): ApiTaskLog {
  return {
    date: toApiDate(taskLog.date),
    task_id: taskLog.taskId,
  };
}

export function mapTaskLogResponse(data: ApiTaskLog): TaskLog {
  return {
    date: new Date(data.date),
    taskId: data.task_id,
  };
}

export function mapTaskLogRequestArray(taskLog: TaskLog[]): ApiTaskLog[] {
  return taskLog.map((t) => mapTaskLogRequest(t));
}

export function mapTaskLogResponseArray(data: ApiTaskLog[]): TaskLog[] {
  return data.map((t) => mapTaskLogResponse(t));
}
