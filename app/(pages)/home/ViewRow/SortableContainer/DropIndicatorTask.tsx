"use client";

import clsx from "clsx";
import { RefObject } from "react";

interface DropIndicatorProps {
  ref?: RefObject<HTMLDivElement | null>;
  groupId: string | null;
  beforeId?: string;
  afterId?: string;
  className?: string;
}

export default function DropIndicatorTask({
  ref,
  groupId,
  beforeId,
  afterId,
  className,
}: DropIndicatorProps) {
  return (
    <div
      ref={ref}
      className={clsx(
        className,
        "app-DropIndicatorTask drop-indicator sticky z-10 flex h-0 items-center opacity-0"
      )}
      data-sort="task"
      data-group-id={groupId}
      data-before-id={beforeId}
      data-after-id={afterId}
    >
      <div className="h-2 w-2 rounded-full bg-[var(--gray-9)]" />
      <div className="h-0.5 flex-1 bg-[var(--gray-9)]" />
    </div>
  );
}
