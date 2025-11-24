import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { memo } from "react";
import TaskItem from "./TaskItem";

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
