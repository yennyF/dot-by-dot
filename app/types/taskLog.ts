export type TaskLog = {
  taskId: string;
  date: Date;
  userId?: string;
};

export type ApiTaskLog = {
  task_id: string;
  date: string; // Format: "M/D/YYYY"
  user_id?: string;
};

export function toApiDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function mapTaskLogRequest(taskLog: TaskLog): ApiTaskLog {
  return {
    date: toApiDate(taskLog.date),
    task_id: taskLog.taskId,
    user_id: taskLog.userId,
  };
}

export function mapTaskLogResponse(data: ApiTaskLog): TaskLog {
  return {
    date: new Date(data.date),
    taskId: data.task_id,
    userId: data.user_id,
  };
}

export function mapTaskLogRequestArray(taskLog: TaskLog[]): ApiTaskLog[] {
  return taskLog.map((t) => mapTaskLogRequest(t));
}

export function mapTaskLogResponseArray(data: ApiTaskLog[]): TaskLog[] {
  return data.map((t) => mapTaskLogResponse(t));
}
