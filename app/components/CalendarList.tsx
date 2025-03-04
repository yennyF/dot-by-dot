"use client";

import { RefObject, use, useEffect, useRef, useState } from "react";
import {
  format,
  subMonths,
  eachDayOfInterval,
  addDays,
  isFuture,
  endOfMonth,
  isFirstDayOfMonth,
  isToday,
  startOfMonth,
  isBefore,
} from "date-fns";
import useScrollTo from "../hooks/useScrollTo";
import useOnScreen from "../hooks/useOnScreen";
import { AppContext } from "../AppContext";
import { eachMonthOfInterval } from "date-fns/fp";
import TickedButton from "./TickedButton";
import { PlusIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import AddHabitPopover from "./AddHabitPopover";
import Header from "./Header";

export default function CalendarList() {
  const scrollTarget = useRef<HTMLDivElement>(null);
  const scrollToTarget = useScrollTo(scrollTarget);
  const isVisible = useOnScreen(scrollTarget);

  const currentDate = new Date();
  const maxDate = addDays(currentDate, 6);
  const totalMonths = eachMonthOfInterval({
    start: subMonths(currentDate, 3),
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

      <div className="calendar flex flex-col items-center">
        <Header />

        {/* Body */}
        <div className="calendar-body mt-16">
          {totalMonths.map((date, index) => (
            <MonthRow
              key={index}
              date={date}
              maxDate={maxDate}
              scrollTarget={scrollTarget}
            />
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 flex h-[100px] w-full items-center justify-center shadow-background">
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

interface MonthRowProps {
  date: Date;
  maxDate?: Date;
  scrollTarget: RefObject<HTMLDivElement | null>;
}

function MonthRow({ date, maxDate, scrollTarget }: MonthRowProps) {
  const totalDays = eachDayOfInterval({
    start: startOfMonth(date),
    end:
      !maxDate || isBefore(endOfMonth(date), maxDate)
        ? endOfMonth(date)
        : maxDate,
  });

  return (
    <div className="month-row flex">
      {/* First Column: Sticky */}
      <div className="month-header sticky left-0 flex w-[100px] flex-col items-end bg-[var(--background)]">
        <div className="sticky top-[130px] flex flex-col gap-y-1 text-right font-bold">
          {format(date, "MMMM")}
          <span className="text-xs">{format(date, "yyyy")}</span>
        </div>
      </div>
      {/* Other Columns */}
      <div className="month-body">
        {totalDays.map((day, index) => (
          <DayRow key={index} day={day} scrollTarget={scrollTarget} />
        ))}
      </div>
    </div>
  );
}

interface DayRowProps {
  day: Date;
  scrollTarget: RefObject<HTMLDivElement | null>;
}

export function DayRow({ day, scrollTarget }: DayRowProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { habits, habitsByDate, toggleHabitTrack } = appContext;

  const [dayTracks, setDayTracks] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const dayTracks = habitsByDate[day.toLocaleDateString()] || {};
    setDayTracks(dayTracks);
  }, [day, habitsByDate]);

  const handleTicked = async (date: Date, habitId: number) => {
    setDayTracks((prev) => ({ ...prev, [habitId]: !prev[habitId] }));

    const success = await toggleHabitTrack(date, habitId);
    if (!success) {
      setDayTracks((prev) => ({ ...prev, [habitId]: !prev[habitId] }));
    }
  };

  return (
    <div
      className="day-row grid"
      style={{
        gridTemplateColumns: `100px repeat(${habits?.length || 0}, 110px)`,
      }}
    >
      {/* Second Column: Sticky */}
      <div
        className={`day-header sticky left-[100px] grid w-[100px] place-items-center bg-[var(--background)] ${(isFirstDayOfMonth(day) || isToday(day)) && "font-bold"} ${isToday(day) && "text-[var(--accent)]"}`}
      >
        {isToday(day) && (
          <div
            ref={scrollTarget}
            // important: added the height as an offset for useScrollTo, do not delete it
            className="absolute top-0 h-[200px]"
          ></div>
        )}
        {format(day, "dd")}
      </div>
      {/* Other Columns */}
      {!isFuture(day) &&
        habits?.map((habit, index) => (
          <div key={index} className="day-body grid place-items-center">
            <TickedButton
              active={dayTracks[habit.id] === true}
              onClick={() => handleTicked(day, habit.id)}
            />
          </div>
        ))}
    </div>
  );
}
