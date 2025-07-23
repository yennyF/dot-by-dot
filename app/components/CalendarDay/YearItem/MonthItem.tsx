"use client";

import {
  format,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
  isBefore,
  isAfter,
} from "date-fns";
import DayItem from "./DayItem";
import { AppContext } from "@/app/AppContext";
import { use } from "react";

interface MonthItemProps {
  date: Date;
}

export default function MonthItem({ date }: MonthItemProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("MonthItem must be used within a AppProvider");
  }
  const { minDate, maxDate } = appContext;

  const totalDays = eachDayOfInterval({
    start: isAfter(startOfMonth(date), minDate) ? startOfMonth(date) : minDate,
    end: isBefore(endOfMonth(date), maxDate) ? endOfMonth(date) : maxDate,
  });

  return (
    <div className="month-item w-fit">
      <div className="sticky left-[250px] w-fit bg-[var(--background)] px-[14px] text-xl font-bold">
        {format(date, "MMMM")}
      </div>
      <div className="days mt-4 flex">
        {totalDays.map((date) => (
          <DayItem key={date.toLocaleDateString()} date={date} />
        ))}
      </div>
    </div>
  );
}
