"use client";

import { useEffect } from "react";
import { ShadowBottom, ShadowLeft, ShadowRight, ShadowTop } from "./shadows";
import HeaderRow from "./HeaderRow/HeaderRow";
import Body from "./Body/Body";
import HorizontalDragScroll from "@/app/components/HorizontalDragScroll";
import { useScrollStore } from "@/app/stores/scrollStore";
import CounterRow from "./HeaderCol/CounterRow";
import DateRow from "./HeaderCol/DateRow";

export default function CalendarDay() {
  const contentRef = useScrollStore((s) => s.contentRef);
  const headerColRef = useScrollStore((s) => s.headerColRef);

  useEffect(() => {
    console.log("CalendarDay rendered");
  });

  return (
    <HorizontalDragScroll
      ref={contentRef}
      className="app-CalendarDay scrollbar-none relative mx-[35px] mb-[35px] mt-[60px] max-h-[calc(100dvh-60px-35px)] w-[calc(100dvw-70px)] flex-1 overflow-scroll overscroll-none"
    >
      <div className="sticky top-0 z-20 w-fit">
        <div className="flex items-stretch">
          <ShadowLeft />
          <div ref={headerColRef}>
            <DateRow />
            <CounterRow />
          </div>
          <ShadowRight />
          {/* <TodayHeader /> */}
          {/* HeaderRow */}
          <div className="sticky right-0 z-10 flex w-name shrink-0 items-end bg-[var(--background)]"></div>
        </div>
        <ShadowTop />
      </div>
      <div className="flex w-fit">
        <ShadowLeft />
        <Body />
        <ShadowRight />
        {/* <TodayBody /> */}
        <HeaderRow />
      </div>
      <ShadowBottom />
    </HorizontalDragScroll>
  );
}
