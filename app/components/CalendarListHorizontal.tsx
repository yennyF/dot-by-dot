"use client";

import { RefObject, use, useEffect, useRef, useState } from "react";
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
import useScrollTo from "../hooks/useScrollTo";
import useOnScreen from "../hooks/useOnScreen";
import { AppContext } from "../AppContext";
import { eachMonthOfInterval } from "date-fns/fp";
import TickedButton from "./TickedButton";
import { PlusIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import AddHabitPopover from "./AddHabitPopover";
import { Habit } from "../repositories";

export default function CalendarListHorizontal() {
  const scrollTarget = useRef<HTMLDivElement>(null);
  const scrollToTarget = useScrollTo(scrollTarget);
  const isVisible = useOnScreen(scrollTarget);

  const currentDate = new Date();
  const minDate = startOfMonth(subMonths(currentDate, 3));
  const maxDate = addDays(currentDate, 7);
  const totalYears = eachYearOfInterval({
    start: minDate,
    end: maxDate,
  });

  return (
    <>
      <AddHabitPopover>
        <button className="button-accent fixed bottom-10 right-10 z-20">
          <PlusIcon />
          New Habit
        </button>
      </AddHabitPopover>

      <div className="calendar grid gap-4">
        {/* Header */}
        <div className="calendar-header sticky top-16 z-10 mt-16 flex w-fit bg-[var(--background)]">
          <div className="shadow-background-right sticky left-0 z-10 w-[150px] shrink-0"></div>
          <div className="years flex shrink-0">
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

        {/* Body */}
        <Body minDate={minDate} maxDate={maxDate} />
      </div>

      <div className="shadow-background-bottom fixed bottom-0 flex h-[100px] w-full items-center justify-center">
        <button
          className={`button-accent-outline ${isVisible ? "pointer-events-none opacity-0" : "opacity-100"}`}
          onClick={scrollToTarget}
        >
          Today
          <ArrowDownIcon />
        </button>
      </div>
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
    <div className="year-item">
      <div className="sticky left-[150px] w-fit bg-[var(--background)] text-2xl font-bold">
        {format(date, "yyyy")}
      </div>
      <div className="months flex">
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
    <div className="month-item grid gap-2">
      <div className="sticky left-[150px] w-fit bg-[var(--background)] text-xl font-bold">
        {format(date, "MMMM")}
      </div>
      <div className="days flex">
        {totalDays.map((date, index) => (
          <div
            key={index}
            className={`grid gap-1 ${(isFirstDayOfMonth(date) || isToday(date)) && "font-bold"} ${isToday(date) && "text-[var(--accent)]"}`}
          >
            <div className="flex justify-center text-xs">
              {format(date, "EEE")}
            </div>
            <div
              className={`day-section flex w-[50px] justify-center bg-[var(--background)]`}
            >
              {isToday(date) && (
                <div
                  ref={scrollTarget}
                  // important: added the height as an offset for useScrollTo, do not delete it
                  className="absolute right-0 w-[200px]"
                ></div>
              )}
              {format(date, "dd")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface BodyProps {
  minDate: Date;
  maxDate: Date;
}

export function Body({ minDate, maxDate }: BodyProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { habits } = appContext;

  const totalDays = eachDayOfInterval({
    start: minDate,
    end: maxDate,
  });

  if (!habits || habits.length === 0 || !totalDays || totalDays.length === 0) {
    return;
  }

  return (
    <div className="">
      {habits.map((habit, index) => (
        <div className="flex" key={index}>
          <div
            key={index}
            className="shadow-background-right sticky left-0 flex h-10 w-[150px] shrink-0 items-center"
          >
            {habit.name}
          </div>

          {totalDays.map((date) => (
            <div
              key={`${date.toLocaleDateString()}-${habit.id}`}
              className="day-body flex h-10 w-[50px] items-center justify-center"
            >
              <TickedCell date={date} habit={habit} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

interface TickedCellProps {
  date: Date;
  habit: Habit;
}

export function TickedCell({ date, habit }: TickedCellProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { habitsByDate, toggleHabitTrack } = appContext;

  const [dayTracks, setDayTracks] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const dayTracks = habitsByDate[date.toLocaleDateString()] || {};
    setDayTracks(dayTracks);
  }, [date, habitsByDate]);

  const handleTicked = async (date: Date, habitId: number) => {
    setDayTracks((prev) => ({ ...prev, [habitId]: !prev[habitId] }));

    const success = await toggleHabitTrack(date, habitId);
    if (!success) {
      setDayTracks((prev) => ({ ...prev, [habitId]: !prev[habitId] }));
    }
  };

  return (
    <TickedButton
      active={dayTracks[habit.id] === true}
      onClick={() => handleTicked(date, habit.id)}
    />
  );
}
