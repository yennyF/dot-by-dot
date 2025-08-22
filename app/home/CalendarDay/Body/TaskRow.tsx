"use client";

import { memo } from "react";
import { Task } from "@/app/repositories/types";
import TaskRowItem from "./TaskRowItem";
import { MonthType, useTrackStore } from "@/app/stores/TrackStore";

interface TaskRowProps {
  task: Task;
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
    <div className="app-TaskRow flex w-fit">
      {years.map(([, months], index) => (
        <YearItem key={index} months={months} task={task} />
      ))}
      {/* {currentStreak > 0 && (
        <div className="flex items-center text-nowrap px-2 text-xs">
          {currentStreak} day streak
        </div>
      )} */}
    </div>
  );
}

function YearItem({ months, task }: { months: MonthType[]; task: Task }) {
  return (
    <>
      {months.map(([, days], index) => (
        <MonthItem key={index} days={days} task={task} />
      ))}
    </>
  );
}

function MonthItem({ days, task }: { days: Date[]; task: Task }) {
  return (
    <>
      {days.map((date, index) => (
        <TaskRowItem key={index} date={date} task={task} />
      ))}
    </>
  );
}

const TaskRow = memo(TaskRowWrapper);
export default TaskRow;
