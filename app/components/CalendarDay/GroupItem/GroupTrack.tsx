"use client";

import { useTrackStore } from "@/app/stores/TrackStore";
import { midnightUTCstring, Task } from "@/app/repositories/types";
import {
  CheckIcon,
  LockClosedIcon,
  LockOpen1Icon,
} from "@radix-ui/react-icons";
import { addDays, isToday } from "date-fns";
import clsx from "clsx";
import { useState } from "react";
import CircularProgressBar from "../../CircularProgressBar";
import HoldButton from "../TaskItem/HoldButton";

interface GroupTrackProps {
  date: Date;
  tasks: Task[];
}

export default function GroupTrack({ date, tasks }: GroupTrackProps) {
  const addTracks = useTrackStore((s) => s.addTracks);
  const deleteTracks = useTrackStore((s) => s.deleteTracks);

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

  const dotClassName = clsx(
    "h-4 w-4 transform rounded-full transition-transform duration-100 hover:scale-110 active:scale-90",
    isActive
      ? "bg-[var(--green)]"
      : "bg-[var(--gray)] hover:bg-[var(--green-5)]"
  );

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
        "app-GroupTrack relative flex h-10 w-[50px] items-center justify-center",
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
        <button className={dotClassName} onClick={handleClick}>
          {isActive && <CheckIcon className="text-white" />}
        </button>
      ) : (
        <LockContent
          isActive={isActive}
          dotClassName={dotClassName}
          onFinalize={handleClick}
        />
      )}
    </div>
  );
}

function LockContent({
  isActive,
  dotClassName,
  onFinalize,
  ...props
}: {
  isActive: boolean;
  dotClassName: string;
  onFinalize: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [unlock, setUnlock] = useState(false);

  return (
    <>
      <div className="progress-wrapper absolute">
        <CircularProgressBar
          barColor={isActive ? "var(--green-5)" : "var(--green)"}
          size={22}
          strokeWidth={5}
          progress={progress}
        />
      </div>

      <div className="group relative flex justify-center">
        {unlock ? (
          <LockOpen1Icon className="absolute -top-full h-[11px] w-[11px] text-gray-600 opacity-0 transition-opacity group-hover:opacity-100" />
        ) : (
          <LockClosedIcon className="absolute -top-full h-[11px] w-[11px] text-gray-600 opacity-0 transition-opacity group-hover:opacity-100" />
        )}

        <HoldButton
          {...props}
          className={dotClassName}
          onMouseUp={() => setUnlock(false)}
          onUpdate={setProgress}
          onFinalize={() => {
            setTimeout(() => {
              onFinalize();
              setUnlock(true);
            }, 200); // Hack to match progress bar animation with the callback
          }}
        >
          {isActive && <CheckIcon className="text-white" />}
        </HoldButton>
      </div>
    </>
  );
}
