"use client";

import React, { RefObject } from "react";
import {
  format,
  eachDayOfInterval,
  endOfMonth,
  isToday,
  startOfMonth,
  isBefore,
  endOfYear,
  isAfter,
  startOfYear,
  isWeekend,
} from "date-fns";
import { eachMonthOfInterval } from "date-fns/fp";

interface YearItemProps {
  date: Date;
  minDate: Date;
  maxDate: Date;
  scrollTarget: RefObject<HTMLDivElement | null>;
}

export default function YearItem({
  date,
  minDate,
  maxDate,
  scrollTarget,
}: YearItemProps) {
  const totalMonths = eachMonthOfInterval({
    start: isAfter(startOfYear(date), minDate) ? startOfYear(date) : minDate,
    end: isBefore(endOfYear(date), maxDate) ? endOfYear(date) : maxDate,
  });

  return (
    <div className="year-item w-fit">
      <div className="sticky left-[200px] w-fit bg-[var(--background)] pl-3 pr-3 text-2xl font-bold">
        {format(date, "yyyy")}
      </div>
      <div className="months mt-3 flex">
        {totalMonths.map((date) => {
          const totalDays = eachDayOfInterval({
            start: isAfter(startOfMonth(date), minDate)
              ? startOfMonth(date)
              : minDate,
            end: isBefore(endOfMonth(date), maxDate)
              ? endOfMonth(date)
              : maxDate,
          });

          return (
            <div className="month-item w-fit" key={date.toLocaleDateString()}>
              <div className="sticky left-[200px] w-fit bg-[var(--background)] px-[14px] text-xl font-bold">
                {format(date, "MMMM")}
              </div>
              <div className="days mt-4 flex">
                {totalDays.map((date) => {
                  const isTodayDate = isToday(date);
                  return (
                    <div
                      key={date.toLocaleDateString()}
                      className={`day-item flex w-[50px] flex-col items-center ${isTodayDate && "text-[var(--accent)]"} ${isWeekend(date) && "text-[var(--inverted)]"}`}
                    >
                      <div className="text-center text-xs">
                        {format(date, "EEE")}
                      </div>
                      <div
                        className={`mt-1 flex h-[40px] w-[35px] items-center justify-center font-bold ${isTodayDate && "rounded-full bg-[var(--accent)] text-white"}`}
                      >
                        {format(date, "dd")}
                      </div>
                      {isTodayDate && (
                        <div
                          ref={scrollTarget}
                          // important: added the height as an offset for useScrollTo, do not delete it
                          className="absolute right-0 w-[160px]"
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
