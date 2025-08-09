"use client";

import { RefObject, useEffect } from "react";
import Header from "./Header/Header";
import { ShadowBottom, ShadowLeft, ShadowRight } from "./shadows";
import HeaderSide from "./HeaderSide/HeaderSide";
import Body from "./Body/Body";

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
      className="app-CalendarDay no-scrollbar relative mx-[40px] mb-[30px] mt-[70px] max-h-[calc(100vh-70px-30px)] w-[calc(100vw-80px)] flex-1 overflow-scroll"
    >
      {/* <LoadMore scrollRef={ref} /> */}
      <Header />
      <div className="flex w-fit">
        <HeaderSide ref={ref} />
        <ShadowLeft scrollRef={ref} />
        <Body />
        <ShadowRight />
      </div>
      <ShadowBottom />
    </div>
  );
}
