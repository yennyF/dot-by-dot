"use client";

import { memo } from "react";
import TaskName from "./TaskName";
import { Task } from "@/app/repositories/types";
import TaskTrack from "./TaskTrack";
import { useTrackStore } from "@/app/stores/TrackStore";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfMonth,
  endOfYear,
  isAfter,
  isBefore,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { ShadowLeft, ShadowRight } from "../shadows";

interface TaskItemProps {
  task: Task;
  isDummy?: boolean;
}

function TaskItemWrapper({ task, isDummy }: TaskItemProps) {
  const startDate = useTrackStore((s) => s.startDate);
  const endDate = useTrackStore((s) => s.endDate);

  const totalYears = eachYearOfInterval({
    start: startDate,
    end: endDate,
  });

  // useEffect(() => {
  //   console.log("TaskItem rendered", task.name);
  // });

  return (
    <div className="group/item h-row flex items-center">
      <TaskName task={task} isDummy={isDummy} />
      <ShadowLeft className="h-full" />
      <div className="sticky flex w-fit">
        {totalYears.map((date) => (
          <YearTaskItem
            key={date.toLocaleDateString()}
            date={date}
            task={task}
          />
        ))}
      </div>
      <ShadowRight className="h-full" />
    </div>
  );
}

function YearTaskItem({ date, task }: { date: Date; task: Task }) {
  const startDate = useTrackStore((s) => s.startDate);
  const endDate = useTrackStore((s) => s.endDate);

  const totalMonths = eachMonthOfInterval({
    start: isAfter(startOfYear(date), startDate)
      ? startOfYear(date)
      : startDate,
    end: isBefore(endOfYear(date), endDate) ? endOfYear(date) : endDate,
  });

  return (
    <div className="year-item flex">
      {totalMonths.map((date) => (
        <MonthTaskItem
          key={date.toLocaleDateString()}
          date={date}
          task={task}
        />
      ))}
    </div>
  );
}

function MonthTaskItem({ date, task }: { date: Date; task: Task }) {
  const startDate = useTrackStore((s) => s.startDate);
  const endDate = useTrackStore((s) => s.endDate);

  const totalDays = eachDayOfInterval({
    start: isAfter(startOfMonth(date), startDate)
      ? startOfMonth(date)
      : startDate,
    end: isBefore(endOfMonth(date), endDate) ? endOfMonth(date) : endDate,
  });

  return (
    <div className="month-item flex">
      {totalDays.map((date) => (
        <TaskTrack key={date.toLocaleDateString()} date={date} task={task} />
      ))}
    </div>
  );
}

const TaskItem = memo(TaskItemWrapper);
export default TaskItem;
