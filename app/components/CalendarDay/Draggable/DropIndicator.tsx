"use client";

import clsx from "clsx";
import { RefObject } from "react";

interface DropIndicatorProps {
  beforeId?: string;
  afterId?: string;
  ref?: RefObject<HTMLInputElement>;
  level: "group" | "task" | "ungroup-task";
}

export default function DropIndicator({
  beforeId,
  afterId,
  ref,
  level,
}: DropIndicatorProps) {
  return (
    <div
      ref={ref}
      className={clsx(
        "drop-indicator group sticky left-0 flex w-[200px] items-center opacity-0",
        level === "task" && "pl-[15px]"
      )}
      data-level={level}
      data-before-id={beforeId}
      data-after-id={afterId}
    >
      <div
        className={clsx(
          "h-2 w-2 rounded-full bg-[var(--green)]",
          // level === "ungroup-task" && "bg-[var(--green)]",
          "group-data-[level=ungroup-task]:bg-[var(--green)]",
          // level === "task" && "bg-[var(--accent)]"
          "group-data-[level=task]:bg-[var(--accent)]"
        )}
      ></div>
      <div
        className={clsx(
          "h-0.5 flex-1 bg-[var(--green)]",
          // level === "ungroup-task" && "bg-[var(--green)]",
          "group-data-[level=ungroup-task]:bg-[var(--green)]",
          // level === "task" && "bg-[var(--accent)]"
          "group-data-[level=task]:bg-[var(--accent)]"
        )}
      />
    </div>
  );
}
