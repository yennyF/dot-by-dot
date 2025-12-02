"use client";

import { ShadowBottom, ShadowLeft, ShadowRight, ShadowTop } from "./shadows";
import LogSidebar from "./LogSidebar/LogSidebar";
import HorizontalDragScroll from "@/app/components/HorizontalDragScroll";
import { useScrollStore } from "@/app/stores/scrollStore";
import DateRow from "./LogHeader/DateRow";
import LogContent from "./LogContent/LogContent";

export default function ViewRow() {
  const taskLogRef = useScrollStore((s) => s.taskLogRef);

  return (
    <HorizontalDragScroll
      ref={taskLogRef}
      className="scrollbar-none relative mx-[35px] mb-[35px] mt-[70px] max-h-[calc(100dvh-70px-35px)] w-[calc(100dvw-70px)] flex-1 overflow-scroll overscroll-none"
    >
      <div className="sticky top-0 z-20 w-fit">
        <div className="flex items-stretch">
          <ShadowLeft />
          <DateRow />
          <ShadowRight />
          <div className="sticky right-0 z-10 w-[var(--width-name)] bg-[var(--background)]"></div>
        </div>
        <ShadowTop />
      </div>
      <div className="flex w-fit">
        <ShadowLeft />
        <LogContent />
        <ShadowRight />
        <LogSidebar />
      </div>
      <ShadowBottom />
    </HorizontalDragScroll>
  );
}
