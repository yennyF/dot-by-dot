import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { memo } from "react";
import { toApiDate } from "@/app/types";
import { addDays } from "date-fns";
import TaskDot from "../../dots/TaskDot";
import DotRow from "./DotRow";

function TaskRowWrapper({ taskId }: { taskId: string }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);

  return (
    <DotRow.Root>
      {totalDate.map(({ year, months }) =>
        months.map(({ month, days }) => (
          <div key={`${year}-${month}`} className="flex min-w-[150px]">
            {days.map((date) => (
              <TaskItem key={date.toDateString()} date={date} taskId={taskId} />
            ))}
          </div>
        ))
      )}
    </DotRow.Root>
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
    <DotRow.Item
      isActive={isActive}
      isNextActive={isNextActive}
      color="bg-[var(--accent-4)]"
    >
      <TaskDot date={date} taskId={taskId} isActive={isActive} />
    </DotRow.Item>
  );
}
