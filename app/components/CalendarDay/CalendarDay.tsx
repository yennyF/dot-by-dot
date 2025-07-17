"use client";

import React, { Fragment, use, useEffect, useRef } from "react";
import { subMonths, addDays, startOfMonth } from "date-fns";
import { AppContext } from "../../AppContext";
import useScrollTo from "@/app/hooks/useScrollTo";
import { PlusIcon, TriangleDownIcon } from "@radix-ui/react-icons";
import GroupItem from "./GroupItem";
import Ungroup from "./Ungroup";
import { useGroupStore } from "@/app/stores/GroupStore";
import GroupDummyItem from "./GroupDummyItem";
import CreateDropdown from "../CreateDropdown";
import DraggableScroll from "./Draggable/DraggableScroll";
import DropIndicatorGroup from "./Draggable/DropIndicatorGroup";
import YearItem from "./YearItem";

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
        <div className="flex w-fit flex-col gap-2">
          <Ungroup />
          <GroupDummyItem />
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
      </DraggableScroll>
    </div>
  );
}

/* Shadows */
//<div className="shadow-background-top absolute left-0 top-[143px] z-10 h-[10px] w-full"></div>
//<div className="shadow-background-bottom absolute bottom-0 left-0 z-10 h-[10px] w-full"></div>
//<div className="shadow-background-left absolute left-[200px] top-0 z-10 h-full w-[10px]"></div>
//<div className="shadow-background-right absolute right-0 top-0 z-10 h-full w-[10px]"></div>
