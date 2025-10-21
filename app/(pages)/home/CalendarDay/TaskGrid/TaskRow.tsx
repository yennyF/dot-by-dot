"use client";

import { Task } from "@/app/types";
import { memo } from "react";
import { useTaskLogStore } from "@/app/stores/taskLogStore";
import TaskItem from "./TaskItem";

function TaskRowWrapper({ task }: { task: Task }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);

  return (
    <div className="app-TaskList flex">
      {totalDate.map(([, months]) =>
        months.map(([, days]) =>
          days.map((date, index) => (
            <TaskItem key={index} date={date} task={task} />
          ))
        )
      )}
    </div>
  );
}
const TaskRow = memo(TaskRowWrapper);
export default TaskRow;
