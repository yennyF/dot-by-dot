"use client";

import { isToday, isWeekend } from "date-fns";
import clsx from "clsx";
import { CheckIcon } from "@radix-ui/react-icons";

interface TaskItemProps {
  date: Date;
  taskId: string;
  isActive: boolean;
}

export default function TaskDot({ date, taskId, isActive }: TaskItemProps) {
  const isTodayDate = isToday(date);
  const isWeekendDate = isWeekend(date);

  return (
    <div
      data-task-id={taskId}
      data-date={date}
      data-active={isActive}
      className={clsx(
        "group box-border flex size-[var(--dot-size)] shrink-0 items-center justify-center rounded-full transition-transform duration-100",
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
  );
}
