"use client";

import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { Task, toApiDate } from "@/app/types";
import TaskDot from "../dots/TaskDot";
import Grid from "./Grid";
import useClickLog from "@/app/hooks/useClickLog";

export default function TaskGrid({ task }: { task: Task }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);
  const handleClick = useClickLog();

  return (
    <Grid.Root key={task.id}>
      <Grid.LabelTask>{task.name}</Grid.LabelTask>
      <Grid.Content onClick={handleClick}>
        {totalDate.map(({ months }) =>
          months.map(({ days }) =>
            days.map((date) => <TaskItem date={date} taskId={task.id} />)
          )
        )}
      </Grid.Content>
    </Grid.Root>
  );
}

function TaskItem({ date, taskId }: { date: Date; taskId: string }) {
  const isActive = useTaskLogStore(
    (s) => s.tasksByDate[toApiDate(date)]?.has(taskId) ?? false
  );

  return (
    <Grid.Item key={date.toDateString()} date={date} isActive={isActive}>
      <TaskDot date={date} taskId={taskId} isActive={isActive} />
    </Grid.Item>
  );
}
