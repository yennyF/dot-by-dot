"use client";

import React from "react";
import { useTrackStore } from "@/app/stores/TrackStore";
import { Task } from "@/app/repositories/types";
import { CheckIcon } from "@radix-ui/react-icons";
import { addDays } from "date-fns";
import clsx from "clsx";

interface UngroupTrackProps {
  date: Date;
  task: Task;
}

export default function UngroupTrack({ date, task }: UngroupTrackProps) {
  const dateSet = useTrackStore((s) => s.datesByTask?.[task.id]);
  const setTaskChecked = useTrackStore((s) => s.setTaskChecked);

  const isActive = dateSet?.has(date.toLocaleDateString());
  const isPrevActive = dateSet?.has(addDays(date, -1).toLocaleDateString());
  const isNextActive = dateSet?.has(addDays(date, 1).toLocaleDateString());

  return (
    <div className={"relative flex h-10 w-[50px] items-center justify-center"}>
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
          setTaskChecked(date, task.id, !isActive);
        }}
        onMouseEnter={() => {
          const el = document.querySelector(`.task-name[data-id="${task.id}"]`);
          el?.classList.add("highlight");
        }}
        onMouseLeave={() => {
          const el = document.querySelector(`.task-name[data-id="${task.id}"]`);
          el?.classList.remove("highlight");
        }}
      >
        {isActive && <CheckIcon className="text-white" />}
      </button>
    </div>
  );
}
