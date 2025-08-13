"use client";

import { format, isToday, isWeekend } from "date-fns";
import { LinkReceptor } from "../../../components/Scroll";

interface DayItemProps {
  date: Date;
}

export default function DayItem({ date }: DayItemProps) {
  const isTodayDate = isToday(date);

  const children = (
    <div
      className={`day-item flex w-day flex-col items-center ${isTodayDate && "text-[var(--accent)]"} ${isWeekend(date) && "text-[var(--inverted)]"}`}
    >
      <div className="text-center text-xs">{format(date, "EEE")}</div>
      <div
        className={`flex h-[34px] w-[35px] items-center justify-center font-bold ${isTodayDate && "rounded-full bg-[var(--accent)] text-white"}`}
      >
        {format(date, "dd")}
      </div>
    </div>
  );

  return isTodayDate ? (
    <LinkReceptor key={date.toLocaleDateString()} id="element-today">
      {children}
    </LinkReceptor>
  ) : (
    children
  );
}
