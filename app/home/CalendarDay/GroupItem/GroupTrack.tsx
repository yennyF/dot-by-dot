"use client";

import { useTrackStore } from "@/app/stores/TrackStore";
import { Group } from "@/app/repositories/types";
import { CheckIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { addDays, isToday } from "date-fns";
import clsx from "clsx";
import { useState } from "react";
import { midnightUTCstring } from "@/app/util";
import { useTaskStore } from "@/app/stores/TaskStore";

interface GroupTrackProps {
  date: Date;
  group: Group;
}

export default function GroupTrack({ date, group }: GroupTrackProps) {
  const addTracks = useTrackStore((s) => s.addTracks);
  const deleteTracks = useTrackStore((s) => s.deleteTracks);

  const tasks = useTaskStore((s) => s.tasksByGroup?.[group.id]) || [];
  const taskIdSet = new Set(tasks.map((t) => t.id));

  const todayKey = midnightUTCstring(date);
  const prevKey = midnightUTCstring(addDays(date, -1));
  const nextKey = midnightUTCstring(addDays(date, 1));

  const isActive =
    (useTrackStore(
      (s) => s.tasksByDate?.[todayKey]?.intersection(taskIdSet).size
    ) ?? 0) > 0;
  const isPrevActive =
    (useTrackStore(
      (s) => s.tasksByDate?.[prevKey]?.intersection(taskIdSet).size
    ) ?? 0) > 0;
  const isNextActive =
    (useTrackStore(
      (s) => s.tasksByDate?.[nextKey]?.intersection(taskIdSet).size
    ) ?? 0) > 0;

  const isTodayDate = isToday(date);

  const handleClick = () => {
    const taskIds = Array.from(taskIdSet);
    if (isActive) {
      deleteTracks(date, taskIds);
    } else {
      addTracks(date, taskIds);
    }
  };

  return (
    <div
      className={clsx(
        "app-GroupTrack w-day relative flex items-center justify-center",
        isTodayDate && "isToday"
      )}
    >
      {isPrevActive && isActive && (
        <div className="absolute left-0 right-[50%] z-[-1] h-4 animate-fade-in bg-[var(--green-5)] opacity-0" />
      )}
      {isNextActive && isActive && (
        <div className="absolute left-[50%] right-0 z-[-1] h-4 animate-fade-in bg-[var(--green-5)] opacity-0" />
      )}

      {isTodayDate ? (
        <Dot isActive={isActive} onClick={handleClick} />
      ) : (
        <LockDot isActive={isActive} onClick={handleClick} />
      )}
    </div>
  );
}

interface DotProps extends React.ComponentProps<"button"> {
  isActive: boolean;
}

function Dot({ isActive, ...props }: DotProps) {
  return (
    <button
      {...props}
      className={clsx(
        "h-4 w-4 transform rounded-full transition-transform duration-100 hover:scale-110 active:scale-90",
        isActive
          ? "bg-[var(--green)]"
          : "bg-[var(--gray)] hover:bg-[var(--green-5)]"
      )}
    >
      {isActive && <CheckIcon className="text-white" />}
    </button>
  );
}

function LockDot({ onClick, ...props }: DotProps) {
  const [unlock, setUnlock] = useState<boolean>();

  return (
    <div className="group relative flex justify-center">
      {!unlock && (
        <LockClosedIcon className="absolute -top-full h-[11px] w-[11px] text-gray-600 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
      <Dot
        {...props}
        onClick={(e) => {
          if (unlock) onClick?.(e);
        }}
        onMouseEnter={() => {
          setUnlock(useTrackStore.getState().unlock);
        }}
        onMouseLeave={() => {
          setUnlock(undefined);
        }}
      />
    </div>
  );
}
