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

export function mapTaskResponse(data: ApiTask): Task {
  return {
    id: data.id,
    groupId: data.group_id || undefined,
    name: data.name,
    order: data.order,
  };
}

export function mapTaskRequest(task: Task): ApiTask {
  return {
    id: task.id,
    group_id: task.groupId || null,
    name: task.name,
    order: task.order,
  };
}

export function mapTaskResponseArray(data: ApiTask[]): Task[] {
  return data.map((t) => mapTaskResponse(t));
}

export function mapTaskRequestArray(tasks: Task[]): ApiTask[] {
  return tasks.map((t) => mapTaskRequest(t));
}
