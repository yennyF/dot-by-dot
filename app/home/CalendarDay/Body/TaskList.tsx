"use client";

import { useTaskStore, UNGROUPED_KEY } from "@/app/stores/TaskStore";
import TaskRow from "./TaskRow";

interface TaskListProps {
  groupId: string | null;
}

export default function TaskList({ groupId }: TaskListProps) {
  const dummyTask = useTaskStore((s) =>
    s.dummyTask && s.dummyTask.groupId === (groupId || undefined)
      ? s.dummyTask
      : null
  );

  const key = groupId ?? UNGROUPED_KEY;
  const tasks = useTaskStore((s) => s.tasksByGroup?.[key]);

  return (
    <div>
      {dummyTask && <TaskRow task={dummyTask} isDummy={true} />}
      {tasks?.map((task) => <TaskRow key={task.id} task={task} />)}
    </div>
  );
}
