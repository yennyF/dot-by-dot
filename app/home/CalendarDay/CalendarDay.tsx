"use client";

import { useEffect } from "react";
import Header from "./Header/Header";
import { ShadowBottom, ShadowLeft, ShadowRight } from "./shadows";
import HeaderSide from "./HeaderSide/HeaderSide";
import Body from "./Body/Body";
import HorizontalDragScroll from "@/app/components/HorizontalDragScroll";
import { scrollStore } from "@/app/stores/scrollStore";
import LoadMore from "./LoadMore";

export default function CalendarDay() {
  const scrollRef = scrollStore((s) => s.calendarScrollRef);

  useEffect(() => {
    console.log("CalendarDay rendered");
  });

  return (
    <HorizontalDragScroll
      ref={scrollRef}
      className="app-CalendarDay scrollbar-none relative mx-[40px] mb-[30px] mt-[70px] max-h-[calc(100vh-70px-30px)] w-[calc(100vw-80px)] flex-1 overflow-scroll"
    >
      <Header />
      <div className="sticky left-0 flex w-fit">
        <ShadowLeft />
        <LoadMore scrollRef={scrollRef} />
        <Body />
        <ShadowRight />
        <HeaderSide />
      </div>
      <ShadowBottom />
    </HorizontalDragScroll>
  );
}
