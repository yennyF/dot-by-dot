"use client";

import React, { DragEvent, use } from "react";
import { AppContext } from "../../AppContext";
import TaskName from "./TaskName";

export default function TaskColumn() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { habits, moveHabit } = appContext;

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
  };

  const handleDragEnd = (e: DragEvent) => {
    const habitId = e.dataTransfer.getData("habitId");

    clearHighlights();

    const indicators = getIndicators();
    const el = getNearestIndicator(e, indicators);
    if (!el) return;

    const beforeId = el.element.dataset.before;

    if (beforeId === "-1") {
      moveHabit(Number(habitId), null);
    } else if (beforeId !== habitId) {
      moveHabit(Number(habitId), Number(beforeId));
    }
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

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 25;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(`.drop-indicator`)
    ) as HTMLElement[];
  };

  const handleDragLeave = () => {
    clearHighlights();
  };

  if (!habits || habits.length === 0) {
    return;
  }

  return (
    <>
      <div
        className="sticky left-0 z-[9] w-[200px]"
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {habits.map((habit) => (
          <div key={habit.id} className="relative flex">
            <DropIndicator
              beforeId={habit.id}
              className="drop-indicator absolute top-0"
            />
            <TaskName className="h-10 w-full" habit={habit} />
          </div>
        ))}
        <DropIndicator beforeId={-1} className="drop-indicator" />
      </div>
    </>
  );
}

interface DropIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  beforeId: number;
}

const DropIndicator = ({
  beforeId,
  className,
  ...props
}: DropIndicatorProps) => {
  return (
    <div
      {...props}
      data-before={beforeId}
      className={`${className} drop-indicator left-2 right-2 h-0.5 rounded bg-[var(--inverted)] opacity-0`}
    />
  );
};
