"use client";

import { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isAfter,
  isSameMonth,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import DayItem from "./DayItem";
import { isEqual } from "lodash";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function CalendarMonth() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [totalDays, setTotalDays] = useState<Date[]>([]);

  useEffect(() => {
    console.log("CalendarMonth rendered");
  });

  useEffect(() => {
    const startOfCurrentMonth = startOfMonth(currentDate);
    const endOfCurrentMonth = endOfMonth(currentDate);

    const startOfWeekDate = startOfWeek(startOfCurrentMonth);
    const endOfWeekDate = endOfWeek(endOfCurrentMonth);

    const totalDays = eachDayOfInterval({
      start: startOfWeekDate,
      end: endOfWeekDate,
    });
    setTotalDays(totalDays);
  }, [currentDate]);

  const today = () => {
    setCurrentDate(new Date());
  };

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div>
      <div className="flex h-20 w-full items-center justify-between gap-5">
        <h2 className="text-sm font-bold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <button className="text-sm" onClick={today}>
            Today
          </button>
          <button className="button-icon-sheer" onClick={previousMonth}>
            <ChevronLeftIcon />
          </button>
          <button
            className="button-icon-sheer"
            onClick={nextMonth}
            disabled={isSameMonth(currentDate, new Date())}
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      <div
        className="grid grid-cols-7 gap-2 text-neutral-400"
        style={{ gridTemplateColumns: "repeat(7, min-content)" }}
      >
        {DAY_LABELS.map((day, index) => (
          <div
            key={index}
            className="calendar-day calendar-day-header h-8 w-8 text-center text-xs"
          >
            {day}
          </div>
        ))}
      </div>

      <div
        className="grid grid-cols-7 gap-2 text-neutral-400"
        style={{ gridTemplateColumns: "repeat(7, min-content)" }}
      >
        {totalDays.map((date) => (
          <DayItem key={date.toLocaleDateString()} date={date} />
        ))}
      </div>
    </div>
  );
}
