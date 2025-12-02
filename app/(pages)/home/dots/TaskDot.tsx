"use client";

import { isToday, isWeekend } from "date-fns";
import clsx from "clsx";
import { CheckIcon } from "@radix-ui/react-icons";

interface TaskDotProps {
  date: Date;
  taskId: string;
  isActive: boolean;
  theme: "row" | "grid";
}

export default function TaskDot({
  date,
  taskId,
  isActive,
  theme,
}: TaskDotProps) {
  const isTodayDate = isToday(date);
  const isWeekendDate = isWeekend(date);

  return (
    <div
      data-task-id={taskId}
      data-date={date}
      data-active={isActive}
      className={clsx(
        "group box-border flex size-[var(--size-dot)] shrink-0 items-center justify-center rounded-full transition-transform duration-100",
        "hover:scale-110 hover:border-[1px] hover:border-black",
        "active:scale-90",
        !isActive && "hover:bg-[var(--accent-5)]",
        isActive
          ? "bg-[var(--accent)]"
          : isTodayDate
            ? "bg-[var(--background)]"
            : isWeekendDate
              ? theme === "row"
                ? "bg-[var(--color-dot-2)]"
                : "bg-[var(--color-dot-1)]"
              : "bg-[var(--color-dot-1)]",
        isTodayDate && "border-[1px] border-black"
      )}
    >
      <CheckIcon
        className={clsx(
          "size-4 text-black opacity-0",
          "group-hover:opacity-100",
          isTodayDate && isActive && "opacity-100"
        )}
      />
    </div>
  );
}
