"use client";

import { useTrackStore } from "@/app/stores/TrackStore";
import { midnightUTCstring, Task } from "@/app/repositories/types";
import { CheckIcon } from "@radix-ui/react-icons";
import { addDays, isToday } from "date-fns";
import clsx from "clsx";

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
        isToday(date) && "isToday"
      )}
    >
      {isPrevActive && isActive && (
        <div className="absolute left-0 right-[50%] z-[-1] h-4 animate-fade-in bg-[var(--green-5)] opacity-0" />
      )}
      {isNextActive && isActive && (
        <div className="absolute left-[50%] right-0 z-[-1] h-4 animate-fade-in bg-[var(--green-5)] opacity-0" />
      )}
      <button
        className={clsx(
          "h-4 w-4 transform rounded-full transition-transform duration-100 hover:scale-110 active:scale-90",
          isActive
            ? "bg-[var(--green)]"
            : "bg-[var(--gray)] hover:bg-[var(--green-5)]"
        )}
        onClick={handleClick}
      >
        {isActive && <CheckIcon className="text-white" />}
      </button>
    </div>
  );
}
