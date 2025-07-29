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
        "app-DropIndicatorTask drop-indicator sticky left-[50px] flex w-[200px] items-center opacity-0",
        groupId ? "pl-[15px]" : "pl-0"
      )}
      data-sort="task"
      data-group-id={groupId}
      data-before-id={beforeId}
      data-after-id={afterId}
    >
      <div
        className={clsx(
          "h-2 w-2 rounded-full",
          groupId ? "bg-[var(--accent)]" : "bg-[var(--green)]"
        )}
      ></div>
      <div
        className={clsx(
          "h-0.5 flex-1",
          groupId ? "bg-[var(--accent)]" : "bg-[var(--green)]"
        )}
      />
    </div>
  );
}
