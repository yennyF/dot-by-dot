"use client";

import { useTaskLogStore } from "@/app/stores/taskLogStore";
import styles from "./styles.module.scss";
import useClickLog from "@/app/hooks/useClickLog";
import { toApiDate } from "@/app/types";
import TaskDot from "../dots/TaskDot";
import GridHeader from "./GridHeader";

export default function TaskGrid({ taskId }: { taskId: string }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);
  const paddingDays = useTaskLogStore((s) => s.paddingDays);
  const handleClick = useClickLog();

  return (
    <div className={styles.grid}>
      <GridHeader />
      <div className={styles.log} onClick={handleClick}>
        {paddingDays.map((day) => (
          <div key={day.toDateString()} className="size-[var(--dot-size)]" />
        ))}
        {totalDate.map(({ months }) =>
          months.map(({ days }) =>
            days.map((date) => (
              <TaskItem key={date.toDateString()} date={date} taskId={taskId} />
            ))
          )
        )}
      </div>
    </div>
  );
}

function TaskItem({ date, taskId }: { date: Date; taskId: string }) {
  const isActive = useTaskLogStore(
    (s) => s.tasksByDate[toApiDate(date)]?.has(taskId) ?? false
  );

  return (
    <div className="relative flex shrink-0 items-center justify-center">
      <span className={styles.date}>{date.getDate()}</span>
      <TaskDot date={date} taskId={taskId} isActive={isActive} />
    </div>
  );
}
