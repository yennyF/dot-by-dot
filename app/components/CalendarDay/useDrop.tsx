import clsx from "clsx";
import { DragEvent, RefObject } from "react";

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
        "drop-indicator left-2 right-2 h-0.5 rounded bg-[var(--inverted)] opacity-0",
        className
      )}
      data-before-id={beforeId}
    />
  );
};

export const useDrop = (ref: RefObject<HTMLDivElement | null>) => {
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

  return {
    getIndicators,
    clearHighlights,
    highlightIndicator,
    getNearestIndicator,
  };
};
