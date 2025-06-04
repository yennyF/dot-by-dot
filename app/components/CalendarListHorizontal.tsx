"use client";

import React, { RefObject, use, useRef } from "react";
import {
  format,
  subMonths,
  eachDayOfInterval,
  addDays,
  endOfMonth,
  isFirstDayOfMonth,
  isToday,
  startOfMonth,
  isBefore,
  eachYearOfInterval,
  endOfYear,
  isAfter,
  startOfYear,
} from "date-fns";
// import useScrollTo from "../hooks/useScrollTo";
import { AppContext } from "../AppContext";
import { eachMonthOfInterval } from "date-fns/fp";
import TickedButton from "./TickedButton";
import { PlusIcon } from "@radix-ui/react-icons";
import AddHabitPopover from "./AddHabitPopover";
import { Habit } from "../repositories";

export default function CalendarListHorizontal() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { habits } = appContext;

  const scrollTarget = useRef<HTMLDivElement>(null);
  // const scrollToTarget = useScrollTo(scrollTarget);

  const currentDate = new Date();
  const minDate = startOfMonth(subMonths(currentDate, 3));
  const maxDate = addDays(currentDate, 7);
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
          <div className="calendar-header sticky top-0 z-20 flex w-fit">
            <div className="sticky left-0 z-20 w-[160px] bg-[var(--background)]"></div>
            <div className="sticky left-[160px] flex w-fit bg-[var(--background)]">
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
          <div className="calendar-body">
            {habits.map((habit, index) => (
              <div className="flex w-fit" key={index}>
                <div
                  key={index}
                  className="sticky left-0 z-10 flex h-10 w-[160px] shrink-0 items-center bg-[var(--background)]"
                >
                  <div className="overflow-hidden text-ellipsis text-nowrap">
                    {habit.name}
                  </div>
                </div>
                {totalDays.map((date) => (
                  <TickedDiv
                    key={`${date.toLocaleDateString()}-${habit.id}`}
                    className="flex h-10 w-[50px] items-center justify-center"
                    date={date}
                    habit={habit}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Shadows */}
        <div className="shadow-background-top absolute left-0 top-[143px] z-10 h-[10px] w-full"></div>
        <div className="shadow-background-bottom absolute bottom-0 left-0 z-10 h-[10px] w-full"></div>
        <div className="shadow-background-left absolute left-[160px] top-0 z-10 h-full w-[10px]"></div>
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
      <div className="sticky left-[160px] w-fit bg-[var(--background)] pl-3 pr-3 text-2xl font-bold">
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
      <div className="sticky left-[160px] w-fit bg-[var(--background)] pl-3 pr-3 text-xl font-bold">
        {format(date, "MMMM")}
      </div>
      <div className="days mt-4 flex justify-center">
        {totalDays.map((date, index) => (
          <div
            key={index}
            className={`day-item flex w-[50px] flex-col items-center ${(isFirstDayOfMonth(date) || isToday(date)) && "font-bold"} ${isToday(date) && "text-[var(--accent)]"}`}
          >
            <div className="text-center text-xs">{format(date, "EEE")}</div>
            <div
              className={`mt-1 flex h-[35px] w-[35px] items-center justify-center ${isToday(date) && "rounded-full bg-[var(--accent)] text-white"}`}
            >
              {format(date, "dd")}
            </div>
            {isToday(date) && (
              <div
                ref={scrollTarget}
                // important: added the height as an offset for useScrollTo, do not delete it
                className="absolute right-0 w-[160px]"
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface TickedDivProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date;
  habit: Habit;
}

export function TickedDiv({
  date,
  habit,
  className,
  ...props
}: TickedDivProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { habitsByDate, toggleHabitTrack } = appContext;

  const isCurrentActive =
    habitsByDate[date.toLocaleDateString()]?.[habit.id] || false;
  const isPrevActive =
    habitsByDate[addDays(date, -1).toLocaleDateString()]?.[habit.id] || false;
  const isNextActive =
    habitsByDate[addDays(date, 1).toLocaleDateString()]?.[habit.id] || false;

  const handleTicked = async (date: Date, habitId: number) => {
    await toggleHabitTrack(date, habitId);
  };

  return (
    <div
      {...props}
      className={`relative flex items-center justify-center ${className}`}
    >
      {isPrevActive && isCurrentActive && (
        <div className="absolute left-0 right-[50%] h-4 bg-[var(--accent-4)]"></div>
      )}
      <TickedButton
        className="z-[1]"
        active={isCurrentActive}
        onClick={() => handleTicked(date, habit.id)}
      />
      {isNextActive && isCurrentActive && (
        <div className="absolute left-[50%] right-0 h-4 bg-[var(--accent-4)]"></div>
      )}
    </div>
  );
}
