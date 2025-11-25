"use client";

import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { Task, toApiDate } from "@/app/types";
import TaskDot from "../dots/TaskDot";
import DotGrid from "./DotGrid";
import useClickLog from "@/app/hooks/useClickLog";

export default function TaskGrid({ task }: { task: Task }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);
  const handleClick = useClickLog();

  return (
    <DotGrid.Root key={task.id}>
      <DotGrid.LabelTask>{task.name}</DotGrid.LabelTask>
      <DotGrid.Content onClick={handleClick}>
        {totalDate.map(({ months }) =>
          months.map(({ days }) =>
            days.map((date) => (
              <DotGrid.Item key={date.toDateString()} date={date}>
                <TaskItem date={date} taskId={task.id} />
              </DotGrid.Item>
            ))
          )
        )}
      </DotGrid.Content>
    </DotGrid.Root>
  );
}

function TaskItem({ date, taskId }: { date: Date; taskId: string }) {
  const isActive = useTaskLogStore(
    (s) => s.tasksByDate[toApiDate(date)]?.has(taskId) ?? false
  );

  return <TaskDot date={date} taskId={taskId} isActive={isActive} />;
}
