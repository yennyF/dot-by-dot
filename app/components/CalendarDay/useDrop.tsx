"use client";

import { AppContext } from "@/app/AppContext";
import clsx from "clsx";
import { DragEvent, RefObject, use } from "react";

interface DropIndicatorProps {
  beforeId?: string;
  afterId?: string;
  ref?: RefObject<HTMLInputElement>;
  level: 0 | 1;
}

export const DropIndicator = ({
  beforeId,
  afterId,
  ref,
  level,
}: DropIndicatorProps) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "drop-indicator sticky left-0 flex w-[200px] items-center opacity-0",
        level === 1 && "pl-[15px]"
      )}
      data-before-id={beforeId}
      data-after-id={afterId}
    >
      <div
        className={clsx(
          "h-2 w-2 rounded-full bg-[var(--accent)]",
          level === 0 && "bg-[var(--green)]",
          level === 1 && "bg-[var(--accent)]"
        )}
      ></div>
      <div
        className={clsx(
          "h-0.5 flex-1 bg-[var(--accent)]",
          level === 0 && "bg-[var(--green)]",
          level === 1 && "bg-[var(--accent)]"
        )}
      />
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
