"use client";

import { useTaskLogStore } from "@/app/stores/taskLogStore";
import TaskItem from "./TaskItem";
import styles from "./dot.module.scss";
import useClickLog from "@/app/hooks/useClickLog";

export default function TaskGrid({ taskId }: { taskId: string }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);
  const paddingDays = useTaskLogStore((s) => s.paddingDays);
  const handleClick = useClickLog();

  return (
    <div className={styles.log} onClick={handleClick}>
      {paddingDays.map((_, index) => (
        <div key={index} className="h-row w-day" />
      ))}
      {totalDate.map(({ months }) =>
        months.map(({ days }) =>
          days.map((date) => (
            <TaskItem key={date.toDateString()} date={date} taskId={taskId} />
          ))
        )
      )}
    </div>
  );
}
