"use client";

import React from "react";
import { useStore } from "@/app/Store";
import { Task } from "@/app/repositories/types";
import { CheckIcon } from "@radix-ui/react-icons";
import { addDays } from "date-fns";
import clsx from "clsx";

interface GroupTrackProps {
  date: Date;
  tasks: Task[];
}

export default function GroupTrack({ date, tasks }: GroupTrackProps) {
  const setTasksChecked = useStore((s) => s.setTasksChecked);

  const dateTasks = useStore((s) => s.tasksByDate?.[date.toLocaleDateString()]);
  const prevDateTasks = useStore(
    (s) => s.tasksByDate?.[addDays(date, -1).toLocaleDateString()]
  );
  const nextDateTasks = useStore(
    (s) => s.tasksByDate?.[addDays(date, 1).toLocaleDateString()]
  );

  const isActive = tasks.some((task) => dateTasks?.has(task.id));
  const isPrevActive = tasks.some((task) => prevDateTasks?.has(task.id));
  const isNextActive = tasks.some((task) => nextDateTasks?.has(task.id));

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
