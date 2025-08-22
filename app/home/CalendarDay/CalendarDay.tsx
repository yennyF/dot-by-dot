"use client";

import { useEffect } from "react";
import Header from "./Header/Header";
import { ShadowBottom, ShadowLeft, ShadowRight, ShadowTop } from "./shadows";
import HeaderSide from "./HeaderSide/HeaderSide";
import Body from "./Body/Body";
import HorizontalDragScroll from "@/app/components/HorizontalDragScroll";
import { scrollStore } from "@/app/stores/scrollStore";
import LoadMore from "./LoadMore";
import { TodayBody, TodayHeader } from "./TodayCol";

export default function CalendarDay() {
  const scrollRef = scrollStore((s) => s.calendarScrollRef);

  useEffect(() => {
    console.log("CalendarDay rendered");
  });

  return (
    <HorizontalDragScroll
      ref={scrollRef}
      className="app-CalendarDay scrollbar-none relative top-[60px] mx-[35px] mb-[35px] max-h-[calc(100dvh-60px-35px)] w-[calc(100dvw-70px)] flex-1 overflow-scroll overscroll-none"
    >
      <div className="sticky top-0 z-20 w-fit">
        <div className="flex items-stretch bg-[var(--background)]">
          <ShadowLeft />
          <div className="w-[30px] shrink-0" />
          <Header />
          <ShadowRight />
          <TodayHeader />
          <div className="sticky right-0 z-10 flex w-name shrink-0 items-end bg-[var(--background)]"></div>
        </div>
        <ShadowTop />
      </div>
      <div className="sticky left-0 mt-5 flex w-fit">
        <ShadowLeft />
        <LoadMore scrollRef={scrollRef} />
        <Body />
        <ShadowRight />
        <TodayBody />
        <HeaderSide />
      </div>
      <ShadowBottom />
    </HorizontalDragScroll>
  );
}
