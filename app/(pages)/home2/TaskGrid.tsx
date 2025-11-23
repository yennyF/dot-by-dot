"use client";

import { useTaskLogStore } from "@/app/stores/taskLogStore";
import TaskItem from "./TaskItem";
import styles from "./dot.module.scss";
import useClickLog from "@/app/hooks/useLog";

export default function TaskGrid({ taskId }: { taskId: string }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);
  const handleClick = useClickLog();

  const ghostCount = totalDate[0][0].getDay();
  const pad = Array(ghostCount).fill(null).concat(ghostCount);

  return (
    <div className={styles.log} onClick={handleClick}>
      {pad.map((_, index) => (
        <div key={index} className="h-row w-day"></div>
      ))}
      {totalDate.map(([, months]) =>
        months.map(([, days]) =>
          days.map((date) => (
            <TaskItem key={date.toDateString()} date={date} taskId={taskId} />
          ))
        )
      )}
    </div>
  );
}
