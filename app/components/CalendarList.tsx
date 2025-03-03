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
import {
  addHabitTrack,
  addTrack,
  deleteHabitTrack,
  getHabitTrack,
  GroupedHabitTrack,
} from "../api";
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

  const [groupedHabitTrack, setHabitHistory] = useState<GroupedHabitTrack>({});

  const scrollTarget = useRef<HTMLDivElement>(null);
  const scrollToTarget = useScrollTo(scrollTarget);
  const isVisible = useOnScreen(scrollTarget);

  useEffect(() => {
    (async () => {
      setHabitHistory(await getHabitTrack());
    })();
  }, [habits]);

  const handleTicked = async (date: Date, habitId: number) => {
    const dateString = date.toLocaleDateString();

    if (!groupedHabitTrack[dateString]) {
      const track = await addTrack(date);
      groupedHabitTrack[dateString] = {
        trackId: track.id,
        habits: {},
      };
    }

    if (groupedHabitTrack[dateString].habits[habitId]) {
      await deleteHabitTrack(groupedHabitTrack[dateString].trackId, habitId);
      delete groupedHabitTrack[dateString].habits[habitId];
    } else {
      await addHabitTrack(groupedHabitTrack[dateString].trackId, habitId);
      groupedHabitTrack[dateString].habits[habitId] = true;
    }

    setHabitHistory({ ...groupedHabitTrack });
  };

  const currentDate = new Date();
  const endDate = addDays(currentDate, dayAfter);
  const totalMonths = eachMonthOfInterval({
    start: subMonths(currentDate, 3),
    end: endDate,
  });

  return (
    <>
      <AddHabitPopover>
        <button className="button-accent fixed bottom-10 right-10 z-20">
          <PlusIcon />
          New Habit
        </button>
      </AddHabitPopover>

      <div className="flex flex-col items-center">
        <Header />

        {/* Body */}
        <div className="mt-16">
          {totalMonths.map((date, index) => {
            const totalDays = eachDayOfInterval({
              start: startOfMonth(date),
              end: isBefore(endOfMonth(date), endDate)
                ? endOfMonth(date)
                : endDate,
            });

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
                    const track =
                      groupedHabitTrack[day.toLocaleDateString()] || {};
                    const istoday = isToday(day);

                    return (
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
                              className="absolute top-0 h-[200px]"
                            ></div>
                          )}
                          {format(day, "dd")}
                        </div>
                        {/* Other Columns */}
                        {habits.map((habit, index) => (
                          <div key={index} className="grid place-items-center">
                            {isFuture(day) ? undefined : (
                              <TickedButton
                                active={track.habits?.[habit.id] === true}
                                onClick={() => handleTicked(day, habit.id)}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
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
