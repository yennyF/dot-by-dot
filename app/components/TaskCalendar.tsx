"use client";

import React, { RefObject, use, useRef } from "react";
import {
  format,
  subMonths,
  eachDayOfInterval,
  addDays,
  endOfMonth,
  isToday,
  startOfMonth,
  isBefore,
  eachYearOfInterval,
  endOfYear,
  isAfter,
  startOfYear,
  isWeekend,
} from "date-fns";
// import useScrollTo from "../hooks/useScrollTo";
import { AppContext } from "../AppContext";
import { eachMonthOfInterval } from "date-fns/fp";
import { PlusIcon } from "@radix-ui/react-icons";
import AddHabitPopover from "./AddHabitPopover";
import { TaskColumn } from "./TaskColumn";
import { TaskValue } from "./TaskValue";

export default function TaskCalendar() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { habits } = appContext;

  const scrollTarget = useRef<HTMLDivElement>(null);
  // const scrollToTarget = useScrollTo(scrollTarget);

  const currentDate = new Date();
  const minDate = startOfMonth(subMonths(currentDate, 3));
  const maxDate = addDays(currentDate, 0);
  const totalYears = eachYearOfInterval({
    start: minDate,
    end: maxDate,
  });
  const totalDays = eachDayOfInterval({
    start: minDate,
    end: maxDate,
  });

  if (!habits || habits.length === 0 || !totalDays || totalDays.length === 0) {
    return;
  }

  return (
    <>
      <AddHabitPopover>
        <button className="button-accent fixed bottom-10 right-10 z-20">
          <PlusIcon />
          New Habit
        </button>
      </AddHabitPopover>

      <div className="h-[100px]"></div>

      {/* Controls */}
      {/* <div className="flex h-[64px] w-full items-center justify-end gap-2">
        <button className="button-outline" onClick={scrollToTarget}>
          Today
        </button>
        <button className="button-icon">
          <CaretLeftIcon />
        </button>
        <button className="button-icon">
          <CaretRightIcon />
        </button>
      </div> */}

      <div className="calendar relative ml-[100px] mr-[100px] overflow-hidden">
        <div className="no-scrollbar top-0 max-h-[700px] overflow-x-auto overflow-y-scroll">
          {/* Calendar Header */}
          <div className="calendar-header sticky top-0 z-10 flex w-fit">
            <div className="sticky left-0 z-10 w-[200px] bg-[var(--background)]"></div>
            <div className="sticky left-[200px] flex w-fit bg-[var(--background)]">
              {totalYears.map((date, index) => (
                <YearItem
                  key={index}
                  date={date}
                  minDate={minDate}
                  maxDate={maxDate}
                  scrollTarget={scrollTarget}
                />
              ))}
            </div>
          </div>

          {/* Calendar Body */}
          <div className="calendar-body mt-1 flex w-fit">
            <TaskColumn />
            <div className="sticky left-[200px]">
              {habits.map((habit) => (
                <div className="flex h-10" key={habit.id}>
                  {totalDays.map((date) => (
                    <TaskValue
                      key={`${date.toLocaleDateString()}-${habit.id}`}
                      className="flex w-[50px] items-center justify-center"
                      date={date}
                      habit={habit}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shadows */}
        <div className="shadow-background-top absolute left-0 top-[143px] z-10 h-[10px] w-full"></div>
        <div className="shadow-background-bottom absolute bottom-0 left-0 z-10 h-[10px] w-full"></div>
        <div className="shadow-background-left absolute left-[200px] top-0 z-10 h-full w-[10px]"></div>
        <div className="shadow-background-right absolute right-0 top-0 z-10 h-full w-[10px]"></div>
      </div>

      <div className="h-[500px]"></div>
    </>
  );
}

interface YearItemProps {
  date: Date;
  minDate: Date;
  maxDate: Date;
  scrollTarget: RefObject<HTMLDivElement | null>;
}

function YearItem({ date, minDate, maxDate, scrollTarget }: YearItemProps) {
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
        {totalMonths.map((date, index) => (
          <MonthItem
            key={index}
            date={date}
            minDate={minDate}
            maxDate={maxDate}
            scrollTarget={scrollTarget}
          />
        ))}
      </div>
    </div>
  );
}

interface MonthItemProps {
  date: Date;
  minDate: Date;
  maxDate: Date;
  scrollTarget: RefObject<HTMLDivElement | null>;
}

function MonthItem({ date, minDate, maxDate, scrollTarget }: MonthItemProps) {
  const totalDays = eachDayOfInterval({
    start: isAfter(startOfMonth(date), minDate) ? startOfMonth(date) : minDate,
    end: isBefore(endOfMonth(date), maxDate) ? endOfMonth(date) : maxDate,
  });

  return (
    <div className="month-item w-fit">
      <div className="sticky left-[200px] w-fit bg-[var(--background)] pl-[14px] pr-[14px] text-xl font-bold">
        {format(date, "MMMM")}
      </div>
      <div className="days mt-4 flex justify-center">
        {totalDays.map((date, index) => {
          const isTodayDate = isToday(date);
          return (
            <div
              key={index}
              className={`day-item flex w-[50px] flex-col items-center ${isTodayDate && "text-[var(--accent)]"} ${isWeekend(date) && "text-[var(--inverted)]"}`}
            >
              <div className="text-center text-xs">{format(date, "EEE")}</div>
              <div
                className={`mt-1 flex h-[35px] w-[35px] items-center justify-center font-bold ${isTodayDate && "rounded-full bg-[var(--accent)] text-white"}`}
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
}
