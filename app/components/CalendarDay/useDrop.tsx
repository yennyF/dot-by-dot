"use client";

import { AppContext } from "@/app/AppContext";
import clsx from "clsx";
import { DragEvent, RefObject, use } from "react";

interface DropIndicatorProps {
  beforeId: number;
  className?: string;
  ref?: RefObject<HTMLInputElement>;
}

export const DropIndicator = ({
  beforeId,
  className,
  ref,
}: DropIndicatorProps) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "drop-indicator sticky left-0 w-[200px] opacity-0",
        className
      )}
      data-before-id={beforeId}
    >
      <div className="round h-0.5 w-full bg-[var(--inverted)]" />
    </div>
  );
};

export const useDrop = (
  ref: RefObject<HTMLDivElement | null>,
  onDrop: (e: DragEvent, el: HTMLElement) => void
) => {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }

  const getIndicators = () => {
    return Array.from(
      ref.current?.querySelectorAll(`.drop-indicator`) ?? []
    ) as HTMLElement[];
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
    console.log(indicators);
    el.element.style.opacity = "1";
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

  const handleDrop = (e: DragEvent) => {
    clearHighlights();

    const indicators = getIndicators();
    const el = getNearestIndicator(e, indicators);
    if (!el) return;

    onDrop(e, el.element);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
  };

  const handleDragLeave = () => {
    clearHighlights();
  };

  return {
    getIndicators,
    clearHighlights,
    highlightIndicator,
    getNearestIndicator,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  };
};
