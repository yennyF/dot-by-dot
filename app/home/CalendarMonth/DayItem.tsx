"use client";

import { format, isToday } from "date-fns";
import { useTaskLogStore } from "../../stores/taskLogStore";
import { toApiDate } from "@/app/repositories/types";

const MAX_TASK_SIZE = 10;

interface DayItemProps {
  date: Date;
}

export default function DayItem({ date }: DayItemProps) {
  const tasks = useTaskLogStore((s) => s.tasksByDate?.[toApiDate(date)]);

  const percentage = Math.min(tasks?.size ?? 0, MAX_TASK_SIZE) / MAX_TASK_SIZE;

  return (
    <div
      className={`calendar-day relative grid h-8 w-8 place-items-center rounded-full text-xs text-black ${isToday(date) ? "outline" : ""}`}
    >
      <div
        className={`absolute -z-10 h-full w-full rounded-full bg-[var(--accent)] transition-opacity duration-100`}
        style={{ opacity: percentage }}
      ></div>
      {format(date, "d")}
    </div>
  );
}
