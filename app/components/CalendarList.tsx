"use client";

import { use, useEffect, useRef, useState } from "react";
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
import { getHabitHistory, HabitHistoryType, updateHabitHitory } from "../api";
import useScrollTo from "../hooks/useScrollTo";
import useOnScreen from "../hooks/useOnScreen";
import { ArrowDownIcon, PlusIcon } from "@radix-ui/react-icons";
import { AppContext } from "../AppContext";
import { eachMonthOfInterval } from "date-fns/fp";
import TickedButton from "./TickedButton";
import AddHabitPopover from "./AddHabitPopover";
import Header from "./Header";

const dayAfter = 6;

export default function CalendarList() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { habits } = appContext;

  const [habitHistory, setHabitHistory] = useState<HabitHistoryType>({});

  const scrollTarget = useRef<HTMLDivElement>(null);
  const scrollToTarget = useScrollTo(scrollTarget);
  const isVisible = useOnScreen(scrollTarget);

  useEffect(() => {
    setHabitHistory(getHabitHistory());
  }, [habits]);

  const toogleHabit = (date: Date, habit: string) => {
    const dateString = date.toDateString();

    if (!habitHistory[dateString]) {
      habitHistory[dateString] = {};
    }

    const value: boolean = habitHistory[dateString][habit] ?? false;
    habitHistory[dateString][habit] = !value;
    setHabitHistory({ ...habitHistory });
    updateHabitHitory(habitHistory);
  };

  const currentDate = new Date();
  const totalMonths = eachMonthOfInterval({
    start: subMonths(currentDate, 12),
    end: addDays(currentDate, dayAfter),
  });

  return (
    <>
      <div className="fixed top-0 z-10 flex h-16 w-full items-center justify-end bg-[var(--background)] px-6">
        <AddHabitPopover>
          <button className="button-accent">
            <PlusIcon />
            Add Habit
          </button>
        </AddHabitPopover>
      </div>

      <div className="flex flex-col items-center">
        <Header />

        {/* Body */}
        <div className="mt-16">
          {totalMonths.map((date, index) => {
            let totalDays = eachDayOfInterval({
              start: startOfMonth(date),
              end: endOfMonth(date),
            });
            const daysAfterToday = addDays(currentDate, dayAfter);
            totalDays = totalDays.filter((day) =>
              isBefore(day, daysAfterToday)
            );
            return (
              <div key={index} className="flex">
                {/* First Column: Sticky */}
                <div className="sticky left-0 flex w-[100px] flex-col items-end bg-[var(--background)]">
                  <div className="sticky top-[130px] flex flex-col gap-y-1 text-right font-bold">
                    {format(date, "MMMM")}
                    <span className="text-xs">{format(date, "yyyy")}</span>
                  </div>
                </div>
                {/* Other Columns */}
                <div>
                  {totalDays.map((day, index) => {
                    const track = habitHistory[day.toDateString()];
                    const istoday = isToday(day);
                    return (
                      <div key={index}>
                        <div
                          key={index}
                          className="grid"
                          style={{
                            gridTemplateColumns: `100px repeat(${habits.length}, 110px`,
                          }}
                        >
                          {/* Second Column: Sticky */}
                          <div
                            className={`sticky left-[100px] grid place-items-center bg-[var(--background)] ${(isFirstDayOfMonth(day) || istoday) && "font-bold"} ${istoday && "text-[var(--accent)]"}`}
                          >
                            {istoday && (
                              <div
                                ref={scrollTarget}
                                // important: added the height as an offset for useScrollTo, do not delete it
                                className="absolute -left-[51px] top-0 h-[200px] font-bold text-[var(--accent)]"
                              >
                                Today
                              </div>
                            )}
                            {format(day, "dd")}
                          </div>
                          {/* Other Columns */}
                          {habits.map((habit) => (
                            <div
                              key={habit}
                              className="grid place-items-center"
                            >
                              {isFuture(day) ? undefined : (
                                <TickedButton
                                  active={track?.[habit] === true}
                                  onClick={() => toogleHabit(day, habit)}
                                />
                              )}
                            </div>
                          ))}
                          {/* Add more columns as needed */}
                        </div>
                      </div>
                    );
                  })}
                  {/* Add more rows as needed */}
                </div>
              </div>
            );
          })}
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
