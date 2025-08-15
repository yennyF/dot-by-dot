"use client";

import { useTaskStore, UNGROUPED_KEY } from "@/app/stores/TaskStore";
import TaskRow from "./TaskRow";
import { useShallow } from "zustand/react/shallow";

interface TaskListProps {
  groupId: string | null;
}

export default function TaskList({ groupId }: TaskListProps) {
  const key = groupId ?? UNGROUPED_KEY;

  const { dummyTask, tasks } = useTaskStore(
    useShallow((s) => ({
      dummyTask:
        s.dummyTask && s.dummyTask.groupId === (groupId || undefined)
          ? s.dummyTask
          : null,
      tasks: s.tasksByGroup?.[key],
    }))
  );

  return (
    <div>
      {dummyTask && <TaskRow task={dummyTask} isDummy={true} />}
      {tasks?.map((task) => <TaskRow key={task.id} task={task} />)}
    </div>
  );
}
