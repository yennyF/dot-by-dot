"use client";

import { useGroupStore } from "@/app/stores/GroupStore";
import { useTaskStore } from "@/app/stores/TaskStore";
import { useRef, DragEvent } from "react";

export default function DraggableScroll({
  children,
  ...props
}: Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onDrag" | "onDrop" | "onDragOver" | "onDragLeave"
>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const taskId = useRef<string>(null);
  const groupId = useRef<string>(null);

  const moveTaskBefore = useTaskStore((s) => s.moveTaskBefore);
  const moveTaskAfter = useTaskStore((s) => s.moveTaskAfter);
  const moveToGroup = useTaskStore((s) => s.moveToGroup);

  const moveGroupBefore = useGroupStore((s) => s.moveGroupBefore);
  const moveGroupAfter = useGroupStore((s) => s.moveGroupAfter);

  const getIndicators = () => {
    return Array.from(
      containerRef.current?.querySelectorAll(
        taskId.current
          ? `[data-level=task].drop-indicator, [data-level=ungroup-task].drop-indicator`
          : groupId.current
            ? `[data-level=group].drop-indicator`
            : ""
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

  // Scroll vertical
  const handleDrag = (e: DragEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollSpeed = 5;
    const threshold = { top: 150, bottom: 10 };

    const { top, bottom } = container.getBoundingClientRect();
    const y = e.clientY;
    const direction =
      y - top < threshold.top ? -1 : bottom - y < threshold.bottom ? 1 : 0;

    if (direction !== 0) container.scrollTop += direction * scrollSpeed;
  };

  const handleDrop = (e: DragEvent) => {
    clearHighlights();

    const indicators = getIndicators();
    const el = getNearestIndicator(e, indicators);
    if (!el) return;

    if (taskId.current) {
      const beforeId = el.element.dataset.beforeId;
      if (beforeId) {
        moveTaskBefore(taskId.current, beforeId);
      } else {
        const afterId = el.element.dataset.afterId;
        if (afterId) {
          moveTaskAfter(taskId.current, afterId);
        } else {
          moveToGroup(taskId.current, null);
        }
      }
    } else if (groupId.current) {
      const beforeId = el.element.dataset.beforeId;
      if (beforeId) {
        moveGroupBefore(groupId.current, beforeId);
      } else {
        const afterId = el.element.dataset.afterId;
        if (afterId) {
          moveGroupAfter(groupId.current, afterId);
        }
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
      {...props}
      ref={containerRef}
      onDrag={handleDrag}
      onDragStart={(e) => {
        taskId.current = e.dataTransfer.getData("taskId");
        groupId.current = e.dataTransfer.getData("groupId");
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {children}
    </div>
  );
}
