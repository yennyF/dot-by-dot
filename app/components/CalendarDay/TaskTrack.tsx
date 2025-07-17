"use client";

import React, { useEffect } from "react";
import { addDays } from "date-fns";
import clsx from "clsx";
import { useTrackStore } from "@/app/stores/TrackStore";
import { midnightUTCstring, Task } from "@/app/repositories/types";
import { CheckIcon } from "@radix-ui/react-icons";

interface TaskTrackProps {
  date: Date;
  task: Task;
}

export default function TaskTrack({ date, task }: TaskTrackProps) {
  const addTrack = useTrackStore((s) => s.addTrack);
  const deleteTrack = useTrackStore((s) => s.deleteTrack);

  const isActive = useTrackStore((s) =>
    s.tasksByDate?.[midnightUTCstring(date)]?.has(task.id)
  );
  const isPrevActive = useTrackStore((s) =>
    s.tasksByDate?.[midnightUTCstring(addDays(date, -1))]?.has(task.id)
  );
  const isNextActive = useTrackStore((s) =>
    s.tasksByDate?.[midnightUTCstring(addDays(date, 1))]?.has(task.id)
  );

  // useEffect(() => {
  //   console.log("TaskTrack rendered", task.name);
  // });

  return (
    <div className="app-TaskTrack relative flex h-10 w-[50px] items-center justify-center">
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
      <button
        className={clsx(
          "h-4 w-4 transform rounded-full transition-transform duration-100 hover:scale-110 active:scale-90",
          isActive
            ? task.groupId
              ? "bg-[var(--accent)]"
              : "bg-[var(--green)]"
            : task.groupId
              ? "bg-[var(--gray)] hover:bg-[var(--accent-5)]"
              : "bg-[var(--gray)] hover:bg-[var(--green-5)]"
        )}
        onClick={() => {
          if (isActive) {
            deleteTrack(date, task.id);
          } else {
            addTrack(date, task.id);
          }
        }}
        onMouseEnter={() => {
          const el = document.querySelector(
            `.app-TaskName[data-id="${task.id}"]`
          );
          el?.classList.add("highlight");
        }}
        onMouseLeave={() => {
          const el = document.querySelector(
            `.app-TaskName[data-id="${task.id}"]`
          );
          el?.classList.remove("highlight");
        }}
      >
        {isActive && !task.groupId && <CheckIcon className="text-white" />}
      </button>
    </div>
  );
}
