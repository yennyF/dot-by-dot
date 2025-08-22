"use client";

import { addDays, isToday } from "date-fns";
import clsx from "clsx";
import { useTrackStore } from "@/app/stores/TrackStore";
import { CheckIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Task } from "@/app/repositories/types";
import { midnightUTCstring } from "@/app/util";

interface TaskRowItemProps {
  date: Date;
  task: Task;
}

export default function TaskRowItem({ date, task }: TaskRowItemProps) {
  const addTrack = useTrackStore((s) => s.addTrack);
  const deleteTrack = useTrackStore((s) => s.deleteTrack);

  const isActive = useTrackStore(
    (s) => s.tasksByDate?.[midnightUTCstring(date)]?.has(task.id) ?? false
  );
  const isPrevActive = useTrackStore(
    (s) =>
      s.tasksByDate?.[midnightUTCstring(addDays(date, -1))]?.has(task.id) ??
      false
  );
  const isNextActive = useTrackStore(
    (s) =>
      s.tasksByDate?.[midnightUTCstring(addDays(date, 1))]?.has(task.id) ??
      false
  );

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
        "app-TaskRowItem relative flex h-row w-day items-center justify-center",
        isTodayDate && "isToday"
      )}
    >
      {isPrevActive && isActive && (
        <div
          className={clsx(
            "absolute left-0 right-[50%] z-[-1] h-3.5 animate-fade-in",
            task.groupId ? "bg-[var(--accent-4)]" : "bg-[var(--accent-4)]"
          )}
        />
      )}

      {isNextActive && isActive && (
        <div
          className={clsx(
            "absolute left-[50%] right-0 z-[-1] h-3.5 animate-fade-in",
            task.groupId ? "bg-[var(--accent-4)]" : "bg-[var(--accent-4)]"
          )}
        />
      )}

      {isTodayDate ? (
        <Dot
          isActive={isActive}
          isTodayDate={isTodayDate}
          onClick={handleClick}
        />
      ) : (
        <LockDot
          isActive={isActive}
          isTodayDate={isTodayDate}
          onClick={handleClick}
        />
      )}
    </div>
  );
}

interface DotProps extends React.ComponentProps<"button"> {
  isActive: boolean;
  isTodayDate: boolean;
}

function Dot({ isActive, isTodayDate, ...props }: DotProps) {
  return (
    <button
      {...props}
      className={clsx(
        "box-border flex size-[var(--dot-size)] transform items-center justify-center rounded-full transition-all duration-100",
        "hover:scale-110",
        "active:scale-90",
        isActive
          ? "bg-[var(--accent)]"
          : isTodayDate
            ? "bg-[var(--background)] hover:bg-[var(--accent-5)]"
            : "bg-[var(--gray)] hover:bg-[var(--accent-5)]",
        isTodayDate && "border-[1px] border-black"
      )}
    >
      {isTodayDate && (
        <CheckIcon
          className={clsx(
            "size-3 text-black transition-opacity",
            isActive ? "opacity-100" : "opacity-0 hover:opacity-100"
          )}
        />
      )}
    </button>
  );
}

function LockDot({ isActive, onClick, ...props }: DotProps) {
  const [unlock, setUnlock] = useState<boolean>();

  return (
    <div className="group relative flex justify-center">
      {unlock === false && (
        <LockClosedIcon className="absolute -top-full h-[11px] w-[11px] text-gray-600 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
      <Dot
        {...props}
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
