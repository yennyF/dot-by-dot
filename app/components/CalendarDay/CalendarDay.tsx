"use client";

import React, { Fragment, use, useEffect, useRef } from "react";
import { subMonths, addDays, startOfMonth } from "date-fns";
import { AppContext } from "../../AppContext";
import useScrollToTarget from "@/app/hooks/useScrollToTarget";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  PlusIcon,
  TriangleDownIcon,
} from "@radix-ui/react-icons";
import GroupItem from "./GroupItem";
import Ungroup from "./Ungroup";
import { useGroupStore } from "@/app/stores/GroupStore";
import GroupDummyItem from "./GroupDummyItem";
import CreateDropdown from "../CreateDropdown";
import DraggableScroll from "./Draggable/DraggableScroll";
import DropIndicatorGroup from "./Draggable/DropIndicatorGroup";
import YearItem from "./YearItem";
import useScrollToSides from "../../hooks/useScrollToSides";
import { Element } from "@/app/components/Scroll";

export default function CalendarDay() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { totalYears } = appContext;

  const todayRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const scrollToTarget = useScrollToTarget(todayRef);
  const {
    isAtTop,
    isAtBottom,
    isAtLeft,
    isAtRight,
    scrollToTop,
    scrollToBottom,
    scrollToLeft,
    scrollToRight,
    scrollVertically,
  } = useScrollToSides(viewportRef);

  const groups = useGroupStore((s) => s.groups);

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
        <div className="flex items-center gap-8">
          <div className="flex gap-1">
            <button
              className="button-icon"
              disabled={isAtLeft}
              onClick={scrollToLeft}
            >
              <ChevronLeftIcon />
            </button>
            <button
              className="button-icon"
              disabled={isAtRight}
              onClick={scrollToRight}
            >
              <ChevronRightIcon />
            </button>
          </div>
          <button className="button-outline" onClick={scrollToTarget}>
            Today
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div
        ref={viewportRef}
        className="calendar-viewport no-scrollbar relative top-0 h-[calc(100vh-100px)] w-[calc(100vw-320px-150px)] overflow-x-auto overflow-y-scroll"
        onDrag={scrollVertically}
      >
        <DraggableScroll>
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
                  todayRef={todayRef}
                />
              ))}
            </div>
          </div>

          {/* Top Scroll */}
          <div className="sticky left-0 top-[148px] z-10 flex w-[calc(100vw-320px-150px)] justify-center bg-[var(--background)] py-2">
            <div className="sticky left-0 flex w-[200px] justify-center">
              <button
                className="button-icon"
                disabled={isAtTop}
                onClick={scrollToTop}
              >
                <ChevronUpIcon />
              </button>
            </div>
          </div>

          {/* Calendar Body */}
          <div className="flex w-fit flex-col gap-2">
            <Ungroup />

            <Element id="create-group">
              <DropIndicatorGroup />
              <GroupDummyItem />
            </Element>

            {groups?.map((group) => (
              <Fragment key={group.id}>
                <DropIndicatorGroup beforeId={group.id} />
                <GroupItem group={group} />
              </Fragment>
            ))}
            {groups && groups.length > 0 && (
              <DropIndicatorGroup afterId={groups[groups.length - 1].id} />
            )}
          </div>

          {/* Bottom Scroll */}
          <div className="sticky bottom-0 left-0 z-10 flex w-[calc(100vw-320px-150px)] justify-center bg-[var(--background)] py-2">
            <div className="sticky left-0 flex w-[200px] justify-center">
              <button
                className="button-icon"
                disabled={isAtBottom}
                onClick={scrollToBottom}
              >
                <ChevronDownIcon />
              </button>
            </div>
          </div>
        </DraggableScroll>
      </div>
    </div>
  );
}

/* Shadows */
//<div className="shadow-background-top absolute left-0 top-[143px] z-10 h-[10px] w-full"></div>
//<div className="shadow-background-bottom absolute bottom-0 left-0 z-10 h-[10px] w-full"></div>
//<div className="shadow-background-left absolute left-[200px] top-0 z-10 h-full w-[10px]"></div>
//<div className="shadow-background-right absolute right-0 top-0 z-10 h-full w-[10px]"></div>
