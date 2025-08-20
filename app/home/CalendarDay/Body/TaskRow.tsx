"use client";

import { memo } from "react";
import { Task } from "@/app/repositories/types";
import TaskRowItem from "./TaskRowItem";
import { MonthType, useTrackStore } from "@/app/stores/TrackStore";

interface TaskRowProps {
  task: Task;
  isDummy?: boolean;
}

function TaskRowWrapper({ task }: TaskRowProps) {
  const years = useTrackStore((s) => s.totalDate);

  // const currentStreak = useTrackStore((s) => s.currentStreaks[task.id]);
  // const updateCurrentStreak = useTrackStore((s) => s.updateCurrentStreak);

  // useEffect(() => {
  //   (async () => {
  //     await updateCurrentStreak(task.id);
  //   })();
  // }, []);

  return (
    <div className="app-TaskRow flex h-row w-fit">
      {years.map(([, months], index) => (
        <YearItem key={index} months={months} task={task} />
      ))}
      {/* {currentStreak > 0 && (
        <div className="flex h-row items-center text-nowrap px-2 text-xs">
          {currentStreak} day streak
        </div>
      )} */}
    </div>
  );
}

function YearItem({ months, task }: { months: MonthType[]; task: Task }) {
  return (
    <div className="app-YearItem flex">
      {months.map(([, days], index) => (
        <MonthItem key={index} days={days} task={task} />
      ))}
    </div>
  );
}

function MonthItem({ days, task }: { days: Date[]; task: Task }) {
  return (
    <div className="app-MonthItem flex">
      {days.map((date, index) => (
        <TaskRowItem key={index} date={date} task={task} />
      ))}
    </div>
  );
}

const TaskRow = memo(TaskRowWrapper);
export default TaskRow;
