"use client";

import { addDays, isToday } from "date-fns";
import clsx from "clsx";
import { useTrackStore } from "@/app/stores/TrackStore";
import { CheckIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Task } from "@/app/repositories/types";
import { midnightUTCstring } from "@/app/util";

interface TaskTrackProps {
  date: Date;
  task: Task;
}

export default function TaskTrack({ date, task }: TaskTrackProps) {
  const addTrack = useTrackStore((s) => s.addTrack);
  const deleteTrack = useTrackStore((s) => s.deleteTrack);

  const isActive =
    useTrackStore((s) =>
      s.tasksByDate?.[midnightUTCstring(date)]?.has(task.id)
    ) ?? false;
  const isPrevActive =
    useTrackStore((s) =>
      s.tasksByDate?.[midnightUTCstring(addDays(date, -1))]?.has(task.id)
    ) ?? false;
  const isNextActive =
    useTrackStore((s) =>
      s.tasksByDate?.[midnightUTCstring(addDays(date, 1))]?.has(task.id)
    ) ?? false;

  const isTodayDate = isToday(date);

  const handleClick = () => {
    if (isActive) {
      deleteTrack(date, task.id);
    } else {
      addTrack(date, task.id);
    }
  };

  return (
    <div
      className={clsx(
        "app-TaskTrack w-day relative flex h-10 items-center justify-center",
        isTodayDate && "isToday"
      )}
    >
      {isPrevActive && isActive && (
        <div
          className={clsx(
            "absolute left-0 right-[50%] z-[-1] h-4 animate-fade-in opacity-0",
            task.groupId ? "bg-[var(--accent-4)]" : "bg-[var(--green-5)]"
          )}
        />
      )}

      {isNextActive && isActive && (
        <div
          className={clsx(
            "absolute left-[50%] right-0 z-[-1] h-4 animate-fade-in opacity-0",
            task.groupId ? "bg-[var(--accent-4)]" : "bg-[var(--green-5)]"
          )}
        />
      )}

      {isTodayDate ? (
        <Dot task={task} isActive={isActive} onClick={handleClick} />
      ) : (
        <LockDot task={task} isActive={isActive} onClick={handleClick} />
      )}
    </div>
  );
}

interface DotProps extends React.ComponentProps<"button"> {
  isActive: boolean;
  task: Task;
}

function Dot({ isActive, task, ...props }: DotProps) {
  return (
    <button
      {...props}
      className={clsx(
        "h-4 w-4 transform rounded-full transition-transform duration-100",
        "hover:scale-110",
        "active:scale-90",
        isActive
          ? task.groupId
            ? "bg-[var(--accent)]"
            : "bg-[var(--green)]"
          : task.groupId
            ? "bg-[var(--gray)] hover:bg-[var(--accent-5)]"
            : "bg-[var(--gray)] hover:bg-[var(--green-5)]"
      )}
    >
      {isActive && <CheckIcon className="text-white" />}
    </button>
  );
}

function LockDot({ task, isActive, onClick, ...props }: DotProps) {
  const [unlock, setUnlock] = useState<boolean>();

  return (
    <div className="group relative flex justify-center">
      {unlock === false && (
        <LockClosedIcon className="absolute -top-full h-[11px] w-[11px] text-gray-600 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
      <Dot
        {...props}
        task={task}
        isActive={isActive}
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
