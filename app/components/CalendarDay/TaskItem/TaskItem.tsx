"use client";

import { memo, useEffect } from "react";
import TaskName from "./TaskName";
import { Task } from "@/app/repositories/types";
import TaskTrack from "./TaskTrack";
import { useTrackStore } from "@/app/stores/TrackStore";

interface TaskItemProps {
  task: Task;
  isDummy?: boolean;
}

function TaskItemWrapper({ task, isDummy }: TaskItemProps) {
  const totalDays = useTrackStore((s) => s.totalDays);

  // useEffect(() => {
  //   console.log("TaskItem rendered", task.name);
  // });

  return (
    <>
      <div className="group/item flex h-[40px] items-center">
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
