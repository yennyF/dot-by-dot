"use client";

import { ShadowBottom, ShadowLeft, ShadowRight, ShadowTop } from "./shadows";
import TaskSidebar from "./TaskSidebar/TaskSidebar";
import TaskGrid from "./TaskGrid/TaskGrid";
import HorizontalDragScroll from "@/app/components/HorizontalDragScroll";
import { useScrollStore } from "@/app/stores/scrollStore";
import DateRow from "./TaskHeader/DateRow";
import { notifyLoadError } from "@/app/components/Notification";
import { useGroupStore } from "@/app/stores/groupStore";
import { useTaskStore } from "@/app/stores/taskStore";
import { useEffect } from "react";
import { useTaskLogStore } from "@/app/stores/taskLogStore";

export default function CalendarDay() {
  const contentRef = useScrollStore((s) => s.contentRef);
  const headerColRef = useScrollStore((s) => s.headerColRef);

  const fetchGroups = useGroupStore((s) => s.fetchGroups);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const fetchTaskLogs = useTaskLogStore((s) => s.fetchTaskLogs);
  const totalDate = useTaskLogStore((s) => s.totalDate);

  useEffect(() => {
    try {
      Promise.all([fetchGroups(), fetchTasks()]);
    } catch {
      notifyLoadError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      fetchTaskLogs();
    } catch {
      notifyLoadError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalDate]);

  return (
    <HorizontalDragScroll
      ref={contentRef}
      className="app-CalendarDay scrollbar-none relative mx-[35px] mb-[35px] mt-[70px] max-h-[calc(100dvh-70px-35px)] w-[calc(100dvw-70px)] flex-1 overflow-scroll overscroll-none"
    >
      <div className="sticky top-0 z-20 w-fit">
        <div className="flex items-stretch">
          <ShadowLeft />
          <div ref={headerColRef}>
            <DateRow />
            {/* <CounterRow /> */}
          </div>
          <ShadowRight />
          <div className="sticky right-0 z-10 w-name bg-[var(--background)]"></div>
        </div>
        <ShadowTop />
      </div>
      <div className="flex w-fit">
        <ShadowLeft />
        <TaskGrid />
        <ShadowRight />
        <TaskSidebar />
      </div>
      <ShadowBottom />
    </HorizontalDragScroll>
  );
}
