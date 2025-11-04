"use client";

import { addDays, isToday } from "date-fns";
import clsx from "clsx";
import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { CheckIcon } from "@radix-ui/react-icons";
import { Task, toApiDate } from "@/app/types";

interface TaskItemProps {
  date: Date;
  task: Task;
}

export default function TaskItem({ date, task }: TaskItemProps) {
  const isActive = useTaskLogStore(
    (s) => s.tasksByDate?.[toApiDate(date)]?.has(task.id) ?? false
  );
  const isPrevActive = useTaskLogStore(
    (s) => s.tasksByDate?.[toApiDate(addDays(date, -1))]?.has(task.id) ?? false
  );
  const isNextActive = useTaskLogStore(
    (s) => s.tasksByDate?.[toApiDate(addDays(date, 1))]?.has(task.id) ?? false
  );

  const isTodayDate = isToday(date);

  return (
    <div
      className={clsx(
        "app-TaskRowItem relative flex h-row w-day items-center justify-center",
        isTodayDate && "isToday"
      )}
    >
      {isPrevActive && isActive && (
        <div
          className={clsx(
            "absolute left-0 right-[50%] z-[-1] h-3.5 animate-fade-in",
            task.groupId ? "bg-[var(--accent-4)]" : "bg-[var(--accent-4)]"
          )}
        />
      )}

      {isNextActive && isActive && (
        <div
          className={clsx(
            "absolute left-[50%] right-0 z-[-1] h-3.5 animate-fade-in",
            task.groupId ? "bg-[var(--accent-4)]" : "bg-[var(--accent-4)]"
          )}
        />
      )}
      <Dot
        id={task.id}
        date={date}
        isActive={isActive}
        isTodayDate={isTodayDate}
      />
    </div>
  );
}

function Dot({
  id,
  date,
  isActive,
  isTodayDate,
}: {
  id: string;
  date: Date;
  isActive: boolean;
  isTodayDate: boolean;
}) {
  const className = isTodayDate
    ? clsx(
        "app-Dot group box-border flex size-[var(--dot-size)] items-center justify-center rounded-full border-[1px] border-black transition-all duration-100",
        "hover:scale-110",
        "active:scale-90",
        isActive
          ? "bg-[var(--accent)]"
          : "bg-[var(--background)] hover:bg-[var(--accent-5)]"
      )
    : clsx(
        "app-PreviousDot group box-border flex size-[var(--dot-size)] items-center justify-center rounded-full transition-all duration-100",
        "hover:scale-110 hover:border-[1px] hover:border-black",
        isActive
          ? "bg-[var(--accent)]"
          : "bg-[var(--gray)] hover:bg-[var(--accent-5)]"
      );

  const classNameIcon = isTodayDate
    ? clsx(
        "size-3 text-black transition-opacity",
        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )
    : clsx(
        "size-3 text-black opacity-0 transition-opacity",
        "group-hover:opacity-100"
      );

  return (
    <div
      data-task-id={id}
      data-date={date}
      data-active={isActive}
      className={className}
    >
      <CheckIcon className={classNameIcon} />
    </div>
  );
}
