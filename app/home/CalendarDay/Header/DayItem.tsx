"use client";

import { format, isToday, isWeekend } from "date-fns";
import { scrollStore } from "@/app/stores/scrollStore";
import { useEffect } from "react";

interface DayItemProps {
  date: Date;
}

export default function DayItem({ date }: DayItemProps) {
  const isTodayDate = isToday(date);
  const day = format(date, "EE");

  const todayRef = scrollStore((s) => (isTodayDate ? s.todayRef : null));

  // Scroll to "today" the first it loads
  useEffect(() => {
    todayRef?.current?.scrollIntoView({
      block: "end",
      behavior: "smooth",
      inline: "start",
    });
  }, [todayRef]);

  const children = (
    <div
      className={`day-item flex w-day flex-col items-center ${isTodayDate && "text-[var(--accent)]"} ${isWeekend(date) && "text-[var(--inverted)]"}`}
    >
      <div className="text-center text-xs">{day[0] + day[1]}</div>
      <div
        className={`flex h-[28px] w-[28px] items-center justify-center font-bold ${isTodayDate && "rounded-full bg-[var(--accent)] text-white"}`}
      >
        {format(date, "dd")}
      </div>
    </div>
  );

  return isTodayDate ? <div ref={todayRef}>{children}</div> : children;
}
