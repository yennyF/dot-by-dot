"use client";

import { format, isToday } from "date-fns";
import { useTrackStore } from "../../stores/TrackStore";
import { midnightUTCstring } from "@/app/util";

const MAX_TASK_SIZE = 10;

interface DayItemProps {
  date: Date;
}

export default function DayItem({ date }: DayItemProps) {
  const tasks = useTrackStore((s) => s.tasksByDate?.[midnightUTCstring(date)]);

  const percentage = Math.min(tasks?.size ?? 0, MAX_TASK_SIZE) / MAX_TASK_SIZE;

  // useEffect(() => {
  //   console.log("DayItem", date.toLocaleDateString());
  // });

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
