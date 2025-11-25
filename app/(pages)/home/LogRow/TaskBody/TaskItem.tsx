"use client";

import { addDays } from "date-fns";
import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { toApiDate } from "@/app/types";
import TaskDot from "../../dots/TaskDot";

interface TaskItemProps {
  date: Date;
  taskId: string;
}

export default function TaskItem({ date, taskId }: TaskItemProps) {
  const isActive = useTaskLogStore(
    (s) => s.tasksByDate[toApiDate(date)]?.has(taskId) ?? false
  );
  const isNextActive = useTaskLogStore(
    (s) => s.tasksByDate[toApiDate(addDays(date, 1))]?.has(taskId) ?? false
  );
  return (
    <div className="app-TaskRowItem relative flex h-row w-day items-center justify-center">
      {isNextActive && isActive && (
        <div className="absolute -right-1/2 left-1/2 z-[-1] h-[var(--dot-size)] animate-fade-in bg-[var(--accent-4)]" />
      )}
      <TaskDot date={date} taskId={taskId} isActive={isActive} />
    </div>
  );
}
