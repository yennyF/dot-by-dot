"use client";

import clsx from "clsx";
import { RefObject } from "react";

interface DropIndicatorGroupProps {
  beforeId?: string;
  afterId?: string;
  ref?: RefObject<HTMLDivElement | null>;
  className?: string;
}

export default function DropIndicatorGroup({
  beforeId,
  afterId,
  ref,
  className,
}: DropIndicatorGroupProps) {
  return (
    <div
      ref={ref}
      className={clsx(
        className,
        "app-DropIndicatorGroup drop-indicator sticky z-10 flex h-0 items-center opacity-0"
      )}
      data-sort="group"
      data-before-id={beforeId}
    >
      <div className="h-2 w-2 rounded-full bg-[var(--black)]"></div>
      <div className="h-0.5 flex-1 bg-[var(--black)]" />
    </div>
  );
}
