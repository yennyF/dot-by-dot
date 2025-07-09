"use client";

import React, { useEffect } from "react";
import { useTrackStore } from "@/app/stores/TrackStore";
import { Task } from "@/app/repositories/types";
import { CheckIcon } from "@radix-ui/react-icons";
import { addDays } from "date-fns";
import clsx from "clsx";

interface GroupTrackProps {
  date: Date;
  tasks: Task[];
}

export default function GroupTrack({ date, tasks }: GroupTrackProps) {
  const setTasksChecked = useTrackStore((s) => s.setTasksChecked);

  const ids = new Set(tasks.map((t) => t.id));

  const todayKey = date.toLocaleDateString();
  const prevKey = addDays(date, -1).toLocaleDateString();
  const nextKey = addDays(date, 1).toLocaleDateString();

  const isActive =
    (useTrackStore((s) => s.tasksByDate?.[todayKey]?.intersection(ids).size) ??
      0) > 0;
  const isPrevActive =
    (useTrackStore((s) => s.tasksByDate?.[prevKey]?.intersection(ids).size) ??
      0) > 0;
  const isNextActive =
    (useTrackStore((s) => s.tasksByDate?.[nextKey]?.intersection(ids).size) ??
      0) > 0;

  useEffect(() => {
    console.log("GroupTrack rendered");
  });

  return (
    <div className="app-GroupTrack relative flex h-10 w-[50px] items-center justify-center">
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
        onClick={() => {
          setTasksChecked(
            date,
            tasks.map((task) => task.id),
            !isActive
          );
        }}
      >
        {isActive && <CheckIcon className="text-white" />}
      </button>
    </div>
  );
}
