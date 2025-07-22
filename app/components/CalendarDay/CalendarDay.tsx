"use client";

import { use, useEffect, useRef } from "react";
import { subMonths, addDays, startOfMonth } from "date-fns";
import { AppContext } from "../../AppContext";
import {
  LockClosedIcon,
  LockOpen1Icon,
  PlusIcon,
  TriangleDownIcon,
} from "@radix-ui/react-icons";
import CreateDropdown from "./CreateDropdown";
import DraggableScroll from "./Draggable/DraggableScroll";
import YearItem from "./YearItem/YearItem";
import { Link } from "@/app/components/Scroll";
import LeftButton from "./SideButtons/LeftButton";
import RightButton from "./SideButtons/RightButton";
import BottomButton from "./SideButtons/BottomButton";
import TopButton from "./SideButtons/TopButton";
import UngroupedTasks from "./UngroupedTasks";
import GroupedTasks from "./GroupedTasks";
import { useTrackStore } from "@/app/stores/TrackStore";
import clsx from "clsx";

export default function CalendarDay() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { totalYears } = appContext;

  const currentDate = new Date();
  const minDate = startOfMonth(subMonths(currentDate, 3));
  const maxDate = addDays(currentDate, 0);

  const lock = useTrackStore((s) => s.lock);
  const setLock = useTrackStore((s) => s.setLock);

  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("CalendarDay rendered");
  });

  return (
    <div className="app-CalendarDay mx-[50px] flex h-[100vh] flex-1 flex-col overflow-hidden">
      {/* Controls */}
      <div className="flex items-center justify-between gap-2 py-[10px]">
        <div className="flex items-center gap-4">
          <CreateDropdown>
            <button className="button-accent-outline">
              <PlusIcon />
              Create
              <TriangleDownIcon />
            </button>
          </CreateDropdown>
          <button className="button-icon-sheer" onClick={() => setLock(!lock)}>
            {lock ? <LockClosedIcon /> : <LockOpen1Icon />}
          </button>
        </div>
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
        className={clsx(
          "calendar-viewport no-scrollbar relative top-0 flex-1 overflow-x-auto overflow-y-scroll",
          lock && "lock"
        )}
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
        <div className="sticky left-0 top-[142px] z-10 flex flex-1 justify-center bg-[var(--background)] py-1">
          <TopButton viewportRef={viewportRef} />
        </div>

        {/* Body Calendar */}
        <UngroupedTasks />
        <GroupedTasks />

        {/* Bottom Scroll */}
        <div className="sticky bottom-0 left-0 z-10 flex flex-1 justify-center bg-[var(--background)] py-1">
          <BottomButton viewportRef={viewportRef} />
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
