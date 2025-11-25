import styles from "./dot.module.scss";
import TaskDot from "../dots/TaskDot";
import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { toApiDate } from "@/app/types";

interface TaskItemProps {
  date: Date;
  taskId: string;
}

export default function TaskItem({ date, taskId }: TaskItemProps) {
  const isActive = useTaskLogStore(
    (s) => s.tasksByDate[toApiDate(date)]?.has(taskId) ?? false
  );

  return (
    <div className="relative flex h-row w-day items-center justify-center">
      <span className={styles.date}>{date.getDate()}</span>
      <TaskDot date={date} taskId={taskId} isActive={isActive} />
    </div>
  );
}
