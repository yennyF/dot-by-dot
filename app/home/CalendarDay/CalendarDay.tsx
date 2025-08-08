"use client";

import { RefObject, useEffect } from "react";
import DraggableScroll from "./Draggable/DraggableScroll";
import GroupList from "./GroupList";
import LoadMore from "./LoadMore";
import Header from "./Header/Header";
import { LinkReceptor } from "@/app/components/Scroll";
import TaskList from "./TaskList";
import { ShadowBottom } from "./shadows";

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
      <LoadMore scrollRef={ref} />
      <Header />
      <DraggableScroll scrollRef={ref}>
        <div className="ungrouped-items flex w-fit flex-col">
          <LinkReceptor id="create-task" />
          <TaskList groupId={null} />
        </div>
        <GroupList />
      </DraggableScroll>
      <ShadowBottom />
    </div>
  );
}
