"use client";

import { memo } from "react";
import { Task } from "@/app/repositories/types";
import TaskRowItem from "./TaskRowItem";
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

interface TaskRowProps {
  task: Task;
  isDummy?: boolean;
}

function TaskRowWrapper({ task }: TaskRowProps) {
  const startDate = useTrackStore((s) => s.startDate);
  const endDate = useTrackStore((s) => s.endDate);

  const totalYears = eachYearOfInterval({
    start: startDate,
    end: endDate,
  });

  return (
    <div className="flex h-row w-fit">
      {totalYears.map((date) => (
        <YearItem key={date.toLocaleDateString()} date={date} task={task} />
      ))}
    </div>
  );
}

function YearItem({ date, task }: { date: Date; task: Task }) {
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
        <MonthItem key={date.toLocaleDateString()} date={date} task={task} />
      ))}
    </div>
  );
}

function MonthItem({ date, task }: { date: Date; task: Task }) {
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
        <TaskRowItem key={date.toLocaleDateString()} date={date} task={task} />
      ))}
    </div>
  );
}

const TaskRow = memo(TaskRowWrapper);
export default TaskRow;
