"use client";

import { useEffect, useRef } from "react";
import DraggableScroll from "./Draggable/DraggableScroll";
import UngroupedTasks from "./UngroupedTasks";
import GroupedTasks from "./GroupedTasks";
import LoadMore from "./LoadMore";
import Header from "./Header/Header";
import TopHeader from "./TopHeader";

export default function CalendarDay() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("CalendarDay rendered");
  });

  return (
    <div
      ref={scrollRef}
      className="app-CalendarDay relative h-[100vh] flex-1 overflow-scroll"
    >
      <TopHeader scrollRef={scrollRef} />

      <LoadMore scrollRef={scrollRef} />

      <div className="calendar flex w-fit">
        {/* Fake left padding */}
        <div className="sticky left-0 top-[70px] z-20 w-[50px] shrink-0 bg-[var(--background)]"></div>

        <div>
          <Header />
          <DraggableScroll scrollRef={scrollRef}>
            <UngroupedTasks />
            <GroupedTasks />
          </DraggableScroll>
        </div>

        {/* Fake right padding */}
        <div className="sticky right-0 top-[70px] z-20 w-[50px] shrink-0 bg-[var(--background)]"></div>
      </div>
    </div>
  );
}

/* Shadows */
//<div className="shadow-background-top absolute left-0 top-[143px] z-10 h-[10px] w-full"></div>
//<div className="shadow-background-bottom absolute bottom-0 left-0 z-10 h-[10px] w-full"></div>
//<div className="shadow-background-left absolute left-[200px] top-0 z-10 h-full w-[10px]"></div>
//<div className="shadow-background-right absolute right-0 top-0 z-10 h-full w-[10px]"></div>
