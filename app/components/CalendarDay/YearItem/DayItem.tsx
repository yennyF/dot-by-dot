"use client";

import { format, isWeekend } from "date-fns";

interface DayItemProps {
  date: Date;
  isTodayDate: boolean;
}

export default function DayItem({ date, isTodayDate }: DayItemProps) {
  return (
    <div
      className={`day-item flex w-[50px] flex-col items-center ${isTodayDate && "text-[var(--accent)]"} ${isWeekend(date) && "text-[var(--inverted)]"}`}
    >
      <div className="text-center text-xs">{format(date, "EEE")}</div>
      <div
        className={`mt-1 flex h-[40px] w-[35px] items-center justify-center font-bold ${isTodayDate && "rounded-full bg-[var(--accent)] text-white"}`}
      >
        {format(date, "dd")}
      </div>
    </div>
  );
}
