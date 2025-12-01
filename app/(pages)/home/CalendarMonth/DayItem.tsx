"use client";

import { format, isToday } from "date-fns";
import { useTaskLogStore } from "../../../stores/taskLogStore";
import { toApiDate } from "@/app/types";
import clsx from "clsx";

const MAX_TASK_SIZE = 10;

interface DayItemProps {
  date: Date;
}

export default function DayItem({ date }: DayItemProps) {
  const tasks = useTaskLogStore(
    (s) => s.tasksByDate[toApiDate(date)]?.size ?? 0
  );

  const percentage = Math.min(tasks, MAX_TASK_SIZE) / MAX_TASK_SIZE;

  return (
    <div className="calendar-day relative grid size-[50px] place-items-center rounded-full text-xs text-black">
      <div
        className={clsx(
          "absolute -z-10 size-[30px] rounded-full bg-[var(--accent)] transition-opacity duration-100",
          isToday(date) && "outline"
        )}
        style={{ opacity: percentage }}
      ></div>
      {format(date, "d")}
    </div>
  );
}
