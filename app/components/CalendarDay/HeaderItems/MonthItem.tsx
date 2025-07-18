"use client";

import {
  format,
  eachDayOfInterval,
  endOfMonth,
  isToday,
  startOfMonth,
  isBefore,
  isAfter,
} from "date-fns";
import { Element } from "../../Scroll";
import DayItem from "./DayItem";

interface MonthItemProps {
  date: Date;
  minDate: Date;
  maxDate: Date;
}

export default function MonthItem({ date, minDate, maxDate }: MonthItemProps) {
  const totalDays = eachDayOfInterval({
    start: isAfter(startOfMonth(date), minDate) ? startOfMonth(date) : minDate,
    end: isBefore(endOfMonth(date), maxDate) ? endOfMonth(date) : maxDate,
  });

  return (
    <div className="month-item w-fit">
      <div className="sticky left-[200px] w-fit bg-[var(--background)] px-[14px] text-xl font-bold">
        {format(date, "MMMM")}
      </div>
      <div className="days mt-4 flex">
        {totalDays.map((date) => {
          const isTodayDate = isToday(date);
          return isTodayDate ? (
            <Element key={date.toLocaleDateString()} id="element-today">
              <DayItem date={date} isTodayDate={isTodayDate} />
            </Element>
          ) : (
            <DayItem
              key={date.toLocaleDateString()}
              date={date}
              isTodayDate={isTodayDate}
            />
          );
        })}
      </div>
    </div>
  );
}
