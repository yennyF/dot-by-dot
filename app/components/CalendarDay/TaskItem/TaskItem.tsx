"use client";

import { memo, use, useEffect } from "react";
import TaskName from "./TaskName";
import { Task } from "@/app/repositories/types";
import TaskTrack from "./TaskTrack";
import { AppContext } from "@/app/AppContext";

interface TaskItemProps {
  task: Task;
  isDummy?: boolean;
}

function TaskItemWrapper({ task, isDummy }: TaskItemProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("TaskItem must be used within a AppProvider");
  }
  const { totalDays } = appContext;

  useEffect(() => {
    console.log("TaskItem rendered", task.name);
  });

  return (
    <>
      <div className="flex h-[40px] items-center">
        <TaskName task={task} isDummy={isDummy} />
        <div className="sticky left-[200px] flex">
          {totalDays.map((date) => (
            <TaskTrack
              key={date.toLocaleDateString()}
              date={date}
              task={task}
            />
          ))}
        </div>
      </div>
    </>
  );
}

const TaskItem = memo(TaskItemWrapper);
export default TaskItem;
