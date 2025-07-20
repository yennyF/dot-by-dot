"use client";

import { useGroupStore } from "@/app/stores/GroupStore";
import { useTaskStore } from "@/app/stores/TaskStore";
import { useRef, DragEvent, ReactNode, RefObject } from "react";

interface DraggableScrollProps {
  children: ReactNode;
  className: string;
  ref: RefObject<HTMLDivElement | null>;
}

export default function DraggableScroll({
  children,
  className,
  ref,
}: DraggableScrollProps) {
  const dataSort = useRef<"task" | "group">(null);

  const moveTaskBefore = useTaskStore((s) => s.moveTaskBefore);
  const moveTaskAfter = useTaskStore((s) => s.moveTaskAfter);

  const moveGroupBefore = useGroupStore((s) => s.moveGroupBefore);
  const moveGroupAfter = useGroupStore((s) => s.moveGroupAfter);

  const scrollVertically = (e: DragEvent) => {
    const el = ref.current;
    if (!el) return;

    const scrollSpeed = 5;
    // TODO handle custom threshold setup
    const threshold = { top: 150, bottom: 50 };

    const { top, bottom } = el.getBoundingClientRect();
    const y = e.clientY;
    const direction =
      y - top < threshold.top ? -1 : bottom - y < threshold.bottom ? 1 : 0;

    if (direction !== 0) el.scrollTop += direction * scrollSpeed;
  };

  const getIndicators = () => {
    if (!dataSort.current) return [];

    return Array.from(
      ref.current?.querySelectorAll(
        `[data-sort=${dataSort.current}].drop-indicator`
      ) ?? []
    ) as HTMLElement[];
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const el = indicators.reduce(
      (closest, indicator) => {
        const box = indicator.getBoundingClientRect();
        const offset = Math.abs(e.clientY - box.top);
        return offset < closest.offset
          ? { offset: offset, element: indicator }
          : closest;
      },
      {
        offset: Number.MAX_VALUE,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);
    if (!el) return;
    el.element.style.opacity = "1";
  };

  const handleDragStart = (e: DragEvent) => {
    dataSort.current = e.dataTransfer.getData("sort") as
      | "task"
      | "group"
      | null;
  };

  const handleDrop = (e: DragEvent) => {
    clearHighlights();

    const indicators = getIndicators();
    const el = getNearestIndicator(e, indicators);
    if (!el) return;

    if (dataSort.current === "task") {
      const taskId = e.dataTransfer.getData("taskId");
      const groupId = el.element.dataset.groupId;
      const beforeId = el.element.dataset.beforeId;
      if (beforeId) {
        moveTaskBefore(taskId, beforeId, groupId ?? null);
      } else {
        moveTaskAfter(taskId, null, groupId ?? null);
      }
    } else if (dataSort.current === "group") {
      const groupId = e.dataTransfer.getData("groupId");
      const beforeId = el.element.dataset.beforeId;
      if (beforeId) {
        moveGroupBefore(groupId, beforeId);
      } else {
        moveGroupAfter(groupId, null);
      }
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
  };

  const handleDragLeave = () => {
    clearHighlights();
  };

  return (
    <div
      ref={ref}
      className={className}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrag={scrollVertically}
    >
      {children}
    </div>
  );
}
