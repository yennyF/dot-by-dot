"use client";

import { addDays, isToday, isWeekend } from "date-fns";
import clsx from "clsx";
import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { CheckIcon } from "@radix-ui/react-icons";
import { toApiDate } from "@/app/types";

interface TaskItemProps {
  date: Date;
  taskId: string;
}

export default function TaskItem({ date, taskId }: TaskItemProps) {
  const isActive = useTaskLogStore(
    (s) => s.tasksByDate[toApiDate(date)]?.has(taskId) ?? false
  );
  const isNextActive = useTaskLogStore(
    (s) => s.tasksByDate[toApiDate(addDays(date, 1))]?.has(taskId) ?? false
  );

  const isTodayDate = isToday(date);
  const isWeekendDate = isWeekend(date);

  return (
    <div className="app-TaskRowItem relative flex h-row w-day items-center justify-center">
      {isNextActive && isActive && (
        <div className="absolute -right-1/2 left-1/2 z-[-1] h-[var(--dot-size)] animate-fade-in bg-[var(--accent-4)]" />
      )}
      <div
        data-task-id={taskId}
        data-date={date}
        data-active={isActive}
        className={clsx(
          "group box-border flex size-[var(--dot-size)] items-center justify-center rounded-full transition-transform duration-100",
          "hover:scale-110 hover:border-[1px] hover:border-black",
          "active:scale-90",
          !isActive && "hover:bg-[var(--accent-5)]",
          isActive
            ? "bg-[var(--accent)]"
            : isTodayDate
              ? "bg-[var(--background)]"
              : isWeekendDate
                ? "bg-[var(--gray-5)]"
                : "bg-[var(--gray)]",
          isTodayDate && "border-[1px] border-black"
        )}
      >
        <CheckIcon
          className={clsx(
            "size-3 text-black opacity-0",
            "group-hover:opacity-100",
            isTodayDate && isActive && "opacity-100"
          )}
        />
      </div>
    </div>
  );
}
