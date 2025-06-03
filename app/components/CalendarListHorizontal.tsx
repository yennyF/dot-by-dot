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
import { PlusIcon, CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
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

      {/* Controls */}
      <div className="fixed top-[64px] z-10 grid h-[64px] w-full grid-flow-col items-center justify-center gap-2 bg-[var(--background)]">
        <button
          className={`button-outline ${isVisible ? "pointer-events-none opacity-0" : "opacity-100"}`}
          onClick={scrollToTarget}
        >
          Today
        </button>
        <button className="button-icon">
          <CaretLeftIcon />
        </button>
        <button className="button-icon">
          <CaretRightIcon />
        </button>
      </div>

      <div className="calendar grid">
        {/* Header */}
        <div className="sticky top-[128px] z-10">
          <div className="flex bg-[var(--background)]">
            <div className="sticky left-0 z-10 w-[160px] shrink-0 bg-[var(--background)]"></div>
            <div className="years flex">
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
          <div className="shadow-background-top sticky left-0 top-[271px] z-10 h-6 w-full"></div>
        </div>

        {/* Body */}
        <div className="mt-[120px]">
          <Body minDate={minDate} maxDate={maxDate} />
        </div>
      </div>

      <div className="shadow-background-bottom fixed bottom-0 right-0 h-[100px] w-full"></div>
      <div className="shadow-background-left fixed bottom-0 right-0 top-0 z-10 w-[100px]"></div>
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
      <div className="sticky left-[160px] w-fit bg-[var(--background)] text-2xl font-bold">
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
    <div className="month-item">
      <div className="sticky left-[160px] w-fit bg-[var(--background)] text-xl font-bold">
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
    <>
      {habits.map((habit, index) => (
        <div className="flex" key={index}>
          <div
            key={index}
            className="sticky left-0 flex h-10 w-[160px] shrink-0 items-center bg-[var(--background)] pl-5"
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
    </>
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
