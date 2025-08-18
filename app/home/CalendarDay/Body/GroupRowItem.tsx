"use client";

import { useTrackStore } from "@/app/stores/TrackStore";
import { Group } from "@/app/repositories/types";
import { addDays, isToday } from "date-fns";
import clsx from "clsx";
import { midnightUTCstring } from "@/app/util";
import { useTaskStore } from "@/app/stores/TaskStore";

interface GroupRowItemProps {
  date: Date;
  group: Group;
}

export default function GroupRowItem({ date, group }: GroupRowItemProps) {
  const tasks = useTaskStore((s) => s.tasksByGroup?.[group.id]) || [];
  const taskIdSet = new Set(tasks.map((t) => t.id));

  const todayKey = midnightUTCstring(date);
  const prevKey = midnightUTCstring(addDays(date, -1));
  const nextKey = midnightUTCstring(addDays(date, 1));

  const isActive =
    useTrackStore(
      (s) => s.tasksByDate?.[todayKey]?.intersection(taskIdSet).size ?? 0
    ) > 0;
  const isPrevActive =
    useTrackStore(
      (s) => s.tasksByDate?.[prevKey]?.intersection(taskIdSet).size ?? 0
    ) > 0;
  const isNextActive =
    useTrackStore(
      (s) => s.tasksByDate?.[nextKey]?.intersection(taskIdSet).size ?? 0
    ) > 0;

  const isTodayDate = isToday(date);

  return (
    <div
      className={clsx(
        "app-GroupRowItem relative flex w-day items-center justify-center",
        isTodayDate && "isToday"
      )}
    >
      {isPrevActive && isActive && (
        <div className="absolute left-0 right-[50%] z-[-1] h-4 animate-fade-in bg-[var(--green-5)] opacity-0" />
      )}
      {isNextActive && isActive && (
        <div className="absolute left-[50%] right-0 z-[-1] h-4 animate-fade-in bg-[var(--green-5)] opacity-0" />
      )}

      <Dot isActive={isActive} />
    </div>
  );
}

interface DotProps extends React.ComponentProps<"div"> {
  isActive: boolean;
}

function Dot({ isActive, ...props }: DotProps) {
  return (
    <div
      {...props}
      className={clsx(
        "h-4 w-4 transform rounded-full",
        isActive ? "bg-[var(--green)]" : "bg-[var(--gray)]"
      )}
    >
      {/* {isActive && <CheckIcon className="text-white" />} */}
    </div>
  );
}
