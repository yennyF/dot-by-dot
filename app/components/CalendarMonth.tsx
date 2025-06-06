"use client";

import { use, useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isToday,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { AppContext } from "../AppContext";

const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

export default function CalendarMonth() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [totalDays, setTotalDays] = useState<Date[]>([]);

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
          <button className="button-icon" onClick={previousMonth}>
            <ChevronLeftIcon />
          </button>
          <button className="button-icon" onClick={nextMonth}>
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      <div
        className="grid grid-cols-7 gap-2 text-neutral-400"
        style={{ gridTemplateColumns: "repeat(7, min-content)" }}
      >
        {dayLabels.map((day, index) => (
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
        {totalDays.map((day, index) => (
          <DayCell key={index} date={day} />
        ))}
      </div>
    </div>
  );
}

interface DayCellProps {
  date: Date;
}

function DayCell({ date }: DayCellProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarGrid must be used within a AppProvider");
  }
  const { habits, habitsByDate } = appContext;

  const habitTrack = habitsByDate[date.toLocaleDateString()] || {};
  const habitsFiltered = habits?.filter(
    (habit) => habitTrack[habit.id] === true
  );
  const percentage =
    habits && habitsFiltered ? habitsFiltered.length / habits.length : 0;

  return (
    <div
      className={`calendar-day relative grid h-8 w-8 place-items-center rounded-full text-xs text-black ${isToday(date) ? "outline" : ""}`}
    >
      <div
        className={`absolute -z-10 h-full w-full rounded-full bg-[var(--accent)]`}
        style={{
          opacity: percentage,
        }}
      ></div>
      {format(date, "d")}
    </div>
  );
}
