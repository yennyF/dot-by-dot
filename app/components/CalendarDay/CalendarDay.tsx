"use client";

import React, { Fragment, RefObject, use, useEffect, useRef } from "react";
import {
  format,
  subMonths,
  eachDayOfInterval,
  addDays,
  endOfMonth,
  isToday,
  startOfMonth,
  isBefore,
  endOfYear,
  isAfter,
  startOfYear,
  isWeekend,
} from "date-fns";
import { AppContext } from "../../AppContext";
import { eachMonthOfInterval } from "date-fns/fp";
import useScrollTo from "@/app/hooks/useScrollTo";
import { PlusIcon, TriangleDownIcon } from "@radix-ui/react-icons";
import GroupItem from "./GroupItem";
import Ungroup from "./Ungroup";
import { useGroupStore } from "@/app/stores/GroupStore";
import GroupDummyItem from "./GroupDummyItem";
import CreateDropdown from "../CreateDropdown";
import DraggableScroll from "./Draggable/DraggableScroll";
import DropIndicator from "./Draggable/DropIndicator";

export default function CalendarDay() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { totalYears } = appContext;

  const groups = useGroupStore((s) => s.groups);

  const scrollTarget = useRef<HTMLDivElement>(null);
  const scrollToTarget = useScrollTo(scrollTarget);

  const currentDate = new Date();
  const minDate = startOfMonth(subMonths(currentDate, 3));
  const maxDate = addDays(currentDate, 0);

  useEffect(() => {
    console.log("CalendarDay rendered");
  });

  return (
    <div className="app-CalendarDay mx-[50px] overflow-hidden">
      {/* Controls */}
      <div className="flex h-[80px] w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CreateDropdown>
            <button className="button-accent-outline">
              <PlusIcon />
              Create
              <TriangleDownIcon />
            </button>
          </CreateDropdown>
        </div>
        <div className="flex items-center gap-2">
          {/* <button className="button-icon">
            <CaretLeftIcon />
          </button>
          <button className="button-icon">
            <CaretRightIcon />
          </button> */}
          <button className="button-outline" onClick={scrollToTarget}>
            Today
          </button>
        </div>
      </div>

      {/* Calendar */}
      <DraggableScroll className="calendar-viewport no-scrollbar relative top-0 h-[calc(100vh-100px)] w-[calc(100vw-320px-100px)] overflow-x-auto overflow-y-scroll">
        {/* Calendar Header */}
        <div className="calendar-header sticky top-0 z-10 flex w-fit">
          <div className="sticky left-0 z-10 flex w-[200px] items-end bg-[var(--background)]" />
          <div className="sticky left-[200px] flex w-fit bg-[var(--background)]">
            {totalYears.map((date) => (
              <YearItem
                key={date.toLocaleDateString()}
                date={date}
                minDate={minDate}
                maxDate={maxDate}
                scrollTarget={scrollTarget}
              />
            ))}
          </div>
        </div>

        {/* Calendar Body */}
        <div className="flex w-fit flex-col gap-3">
          <Ungroup />
          <GroupDummyItem />
          {groups?.map((group) => (
            <Fragment key={group.id}>
              <DropIndicator level="group" beforeId={group.id} />
              <GroupItem group={group} />
            </Fragment>
          ))}
          {groups && groups.length > 0 && (
            <DropIndicator
              level="group"
              afterId={groups[groups.length - 1].id}
            />
          )}
        </div>
      </DraggableScroll>
    </div>
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
        })}
      </div>
    </div>
  );
}

/* Shadows */
//<div className="shadow-background-top absolute left-0 top-[143px] z-10 h-[10px] w-full"></div>
//<div className="shadow-background-bottom absolute bottom-0 left-0 z-10 h-[10px] w-full"></div>
//<div className="shadow-background-left absolute left-[200px] top-0 z-10 h-full w-[10px]"></div>
//<div className="shadow-background-right absolute right-0 top-0 z-10 h-full w-[10px]"></div>
