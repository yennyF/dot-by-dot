"use client";

import React from "react";
import { addDays } from "date-fns";
import { Task } from "../../repositories";
import clsx from "clsx";
import { useStore } from "@/app/Store";

interface TaskValueProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date;
  task: Task;
}

export default function TaskValue({
  date,
  task,
  className,
  ...props
}: TaskValueProps) {
  const dateSet = useStore((s) => s.taskGroup?.[task.id]);
  const setTaskChecked = useStore((s) => s.setTaskChecked);

  const isCurrentActive = dateSet?.has(date.toLocaleDateString());
  const isPrevActive = dateSet?.has(addDays(date, -1).toLocaleDateString());
  const isNextActive = dateSet?.has(addDays(date, 1).toLocaleDateString());

  return (
    <div
      {...props}
      className={`relative flex items-center justify-center ${className}`}
    >
      {isPrevActive && isCurrentActive && (
        <div className="animate-fade-in absolute left-0 right-[50%] h-4 bg-[var(--accent-4)] opacity-0" />
      )}
      {isNextActive && isCurrentActive && (
        <div className="animate-fade-in absolute left-[50%] right-0 h-4 bg-[var(--accent-4)] opacity-0" />
      )}
      <button
        className={clsx(
          "z-[1] h-4 w-4 transform rounded-full transition-transform duration-100 hover:scale-110 active:scale-90",
          isCurrentActive
            ? "bg-[var(--accent)]"
            : "bg-[var(--gray)] hover:bg-[var(--accent-5)]"
        )}
        onClick={() => {
          setTaskChecked(date, task.id, !isCurrentActive);
        }}
        onMouseEnter={() => {
          const el = document.querySelector(`.task-name[data-id="${task.id}"]`);
          el?.classList.add("highlight");
        }}
        onMouseLeave={() => {
          const el = document.querySelector(`.task-name[data-id="${task.id}"]`);
          el?.classList.remove("highlight");
        }}
      ></button>
    </div>
  );
}
