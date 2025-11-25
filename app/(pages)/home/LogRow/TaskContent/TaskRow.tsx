import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { memo } from "react";
import { toApiDate } from "@/app/types";
import { addDays } from "date-fns";
import TaskDot from "../../dots/TaskDot";

function TaskRowWrapper({ taskId }: { taskId: string }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);

  return (
    <div className="app-TaskList flex">
      {totalDate.map(({ year, months }) =>
        months.map(({ month, days }) => (
          <div key={`${year}-${month}`} className="flex min-w-[150px]">
            {days.map((date) => (
              <TaskItem key={date.toDateString()} date={date} taskId={taskId} />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
const TaskRow = memo(TaskRowWrapper);
export default TaskRow;

function TaskItem({ date, taskId }: { date: Date; taskId: string }) {
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
