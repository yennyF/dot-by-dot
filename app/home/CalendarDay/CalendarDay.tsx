"use client";

import { RefObject, useEffect } from "react";
import DraggableScroll from "./Draggable/DraggableScroll";
import UngroupedTasks from "./UngroupedTasks";
import GroupedTasks from "./GroupedTasks";
import LoadMore from "./LoadMore";
import Header from "./Header/Header";

interface CalendarDayProps {
  ref: RefObject<HTMLDivElement | null>;
}

export default function CalendarDay({ ref }: CalendarDayProps) {
  useEffect(() => {
    console.log("CalendarDay rendered");
  });

  return (
    <div
      ref={ref}
      className="app-CalendarDay no-scrollbar relative mx-[40px] h-[100vh] w-[calc(100vw-80px)] flex-1 overflow-scroll"
    >
      <LoadMore scrollRef={ref} />

      <Header />
      <DraggableScroll scrollRef={ref} className="mt-[70px]">
        <UngroupedTasks />
        <GroupedTasks />
      </DraggableScroll>
    </div>
  );
}

/* Shadows */
//<div className="shadow-background-top absolute left-0 top-[143px] z-10 h-[10px] w-full"></div>
//<div className="shadow-background-bottom absolute bottom-0 left-0 z-10 h-[10px] w-full"></div>
//<div className="shadow-background-left absolute left-[200px] top-0 z-10 h-full w-[10px]"></div>
//<div className="shadow-background-right absolute right-0 top-0 z-10 h-full w-[10px]"></div>
