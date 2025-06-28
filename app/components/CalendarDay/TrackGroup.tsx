"use client";

import React from "react";
import { useStore } from "@/app/Store";
import { Task } from "@/app/repositories/types";
import { CheckIcon } from "@radix-ui/react-icons";
import { addDays } from "date-fns";

interface TrackGroupProps {
  date: Date;
  tasks: Task[];
}

export default function TrackGroup({ date, tasks }: TrackGroupProps) {
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
      {isActive ? (
        <div className={"h-4 w-4 rounded-full bg-[var(--green)]"}>
          <CheckIcon className="text-white" />
        </div>
      ) : (
        <div
          className={"h-4 w-4 rounded-full border-[1px] border-[var(--gray-9)]"}
        ></div>
      )}
    </div>
  );
}
