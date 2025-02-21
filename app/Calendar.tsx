"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
  isFuture,
} from "date-fns";
import { generateRandomDaysForMonth } from "./api";
import styles from "./Calendar.module.css";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);

  const startOfWeekDate = startOfWeek(startOfCurrentMonth);
  const endOfWeekDate = endOfWeek(endOfCurrentMonth);
  const totalDays = eachDayOfInterval({
    start: startOfWeekDate,
    end: endOfWeekDate,
  });

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const monthName = format(currentDate, "MMMM yyyy");
  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
  const track = generateRandomDaysForMonth(totalDays);

  return (
    <div className="calendar flex h-screen w-screen flex-col items-center justify-center">
      <div className="h-[550px] w-fit">
        <div className="calendar-header flex h-20 w-full items-center justify-between gap-5">
          <h2>{monthName}</h2>
          <div className="flex gap-10">
            <button
              onClick={() => {
                setCurrentDate(new Date());
              }}
            >
              Today
            </button>
            <button onClick={previousMonth}>{"<"}</button>
            <button onClick={nextMonth}>{">"}</button>
          </div>
        </div>

        <div
          className={`${styles.calendarGridHeader} grid grid-cols-7 gap-3 text-neutral-400`}
        >
          {dayLabels.map((day, index) => (
            <div
              key={index}
              className="calendar-day calendar-day-header h-10 w-14 text-center"
            >
              {day}
            </div>
          ))}
        </div>

        <div className={`${styles.calendarGrid} grid grid-cols-7 gap-3`}>
          {totalDays.map((day, index) => (
            <div
              key={index}
              className={`calendar-day grid h-14 w-14 place-items-center rounded-full ${isToday(day) ? "today" : ""} ${
                isSameMonth(day, currentDate) ? "" : "other-month"
              } ${isFuture(day) ? "text-neutral-700" : ""} ${track[index]?.value ? "bg-neutral-800" : ""} `}
            >
              <div>{format(day, "d")}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
