"use client";

import clsx from "clsx";
import { RefObject } from "react";

interface DropIndicatorProps {
  ref?: RefObject<HTMLInputElement>;
  groupId: string | null;
  beforeId?: string;
  afterId?: string;
}

export default function DropIndicatorTask({
  ref,
  groupId,
  beforeId,
  afterId,
}: DropIndicatorProps) {
  return (
    <div
      ref={ref}
      className={clsx(
        "app-DropIndicatorTask drop-indicator sticky left-[30px] z-10 flex h-0 items-center opacity-0"
      )}
      data-sort="task"
      data-group-id={groupId}
      data-before-id={beforeId}
      data-after-id={afterId}
    >
      <div className="h-2 w-2 rounded-full bg-[var(--gray-9)]" />
      <div className="h-0.5 w-[280px] bg-[var(--gray-9)]" />
    </div>
  );
}
