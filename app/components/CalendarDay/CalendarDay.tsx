"use client";

import React, { use, useEffect, useRef } from "react";
import { subMonths, addDays, startOfMonth } from "date-fns";
import { AppContext } from "../../AppContext";
import { PlusIcon, TriangleDownIcon } from "@radix-ui/react-icons";
import CreateDropdown from "../CreateDropdown";
import DraggableScroll from "./Draggable/DraggableScroll";
import YearItem from "./HeaderItems/YearItem";
import { Link } from "@/app/components/Scroll";
import LeftButton from "./SideButtons/LeftButton";
import RightButton from "./SideButtons/RightButton";
import BottomButton from "./SideButtons/BottomButton";
import TopButton from "./SideButtons/TopButton";
import CalendarBody from "./BodyItems/CalendarBody";

export default function CalendarDay() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { totalYears } = appContext;

  const currentDate = new Date();
  const minDate = startOfMonth(subMonths(currentDate, 3));
  const maxDate = addDays(currentDate, 0);

  const viewportRef = useRef<HTMLDivElement>(null);

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
        {/* Header Calendar */}
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
          <TopButton viewportRef={viewportRef} />
        </div>

        {/* Body Calendar */}
        <CalendarBody />

        {/* Bottom Scroll */}
        <div className="sticky bottom-0 left-0 z-10 flex flex-1 justify-center bg-[var(--background)] py-2">
          <BottomButton viewportRef={viewportRef} />
        </div>
      </DraggableScroll>
    </div>
  );
}
