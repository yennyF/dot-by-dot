"use client";

import React, { Fragment, use, useEffect, useRef } from "react";
import { subMonths, addDays, startOfMonth } from "date-fns";
import { AppContext } from "../../AppContext";
import { PlusIcon, TriangleDownIcon } from "@radix-ui/react-icons";
import GroupItem from "./GroupItem";
import Ungroup from "./Ungroup";
import { useGroupStore } from "@/app/stores/GroupStore";
import GroupItemDummy from "./GroupItemDummy";
import CreateDropdown from "../CreateDropdown";
import DraggableScroll from "./Draggable/DraggableScroll";
import DropIndicatorGroup from "./Draggable/DropIndicatorGroup";
import YearItem from "./HeaderItems/YearItem";
import { Element, Link } from "@/app/components/Scroll";
import LeftButton from "./ButtonSide/LeftButton";
import RightButton from "./ButtonSide/RightButton";
import BottomButton from "./ButtonSide/BottomButton";
import TopButton from "./ButtonSide/TopButton";

export default function CalendarDay() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { totalYears } = appContext;

  const viewportRef = useRef<HTMLDivElement>(null);

  const groups = useGroupStore((s) => s.groups);

  const currentDate = new Date();
  const minDate = startOfMonth(subMonths(currentDate, 3));
  const maxDate = addDays(currentDate, 0);

  useEffect(() => {
    console.log("CalendarDay rendered");
  });

  return (
    <div className="app-CalendarDay mx-[50px] flex h-[100vh] flex-1 flex-col overflow-hidden">
      {/* Controls */}
      <div className="flex items-center justify-between gap-2 py-[10px]">
        <CreateDropdown>
          <button className="button-accent-outline">
            <PlusIcon />
            Create
            <TriangleDownIcon />
          </button>
        </CreateDropdown>
        <div className="flex items-center gap-8">
          <div className="flex gap-1">
            <LeftButton viewportRef={viewportRef} />
            <RightButton viewportRef={viewportRef} />
          </div>
          <Link
            to="element-today"
            options={{ block: "end", behavior: "smooth", inline: "center" }}
            autoScroll={true}
          >
            <button className="button-outline">Today</button>
          </Link>
        </div>
      </div>

      {/* Calendar */}
      <DraggableScroll
        ref={viewportRef}
        className="calendar-viewport no-scrollbar relative top-0 flex-1 overflow-x-auto overflow-y-scroll"
      >
        {/* <DraggableScroll> */}
        {/* Header */}
        <div className="calendar-header sticky top-0 z-10 flex w-fit">
          <div className="sticky left-0 z-10 flex w-[200px] items-end bg-[var(--background)]" />
          <div className="sticky left-[200px] flex w-fit bg-[var(--background)]">
            {totalYears.map((date) => (
              <YearItem
                key={date.getFullYear()}
                date={date}
                minDate={minDate}
                maxDate={maxDate}
              />
            ))}
          </div>
        </div>

        {/* Top Scroll */}
        <div className="sticky left-0 top-[148px] z-10 flex flex-1 justify-center bg-[var(--background)] py-2">
          <div className="sticky left-0 flex w-[200px] justify-center">
            <TopButton viewportRef={viewportRef} />
          </div>
        </div>

        {/* Body */}
        <div className="flex w-fit flex-col gap-2">
          <Ungroup />

          <Element id="create-group">
            <DropIndicatorGroup />
            <GroupItemDummy />
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
        <div className="sticky bottom-0 left-0 z-10 flex flex-1 justify-center bg-[var(--background)] py-2">
          <div className="sticky left-0 flex w-[200px] justify-center">
            <BottomButton viewportRef={viewportRef} />
          </div>
        </div>
        {/* </DraggableScroll> */}
      </DraggableScroll>
    </div>
  );
}

/* Shadows */
//<div className="shadow-background-top absolute left-0 top-[143px] z-10 h-[10px] w-full"></div>
//<div className="shadow-background-bottom absolute bottom-0 left-0 z-10 h-[10px] w-full"></div>
//<div className="shadow-background-left absolute left-[200px] top-0 z-10 h-full w-[10px]"></div>
//<div className="shadow-background-right absolute right-0 top-0 z-10 h-full w-[10px]"></div>
