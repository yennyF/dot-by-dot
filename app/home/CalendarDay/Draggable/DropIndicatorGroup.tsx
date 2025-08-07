"use client";

import { RefObject } from "react";

interface DropIndicatorGroupProps {
  beforeId?: string;
  afterId?: string;
  ref?: RefObject<HTMLInputElement>;
}

export default function DropIndicatorGroup({
  beforeId,
  afterId,
  ref,
}: DropIndicatorGroupProps) {
  return (
    <div
      ref={ref}
      className="app-DropIndicatorGroup drop-indicator sticky left-[60px] flex w-[160px] items-center opacity-0"
      data-sort="group"
      data-before-id={beforeId}
      data-after-id={afterId}
    >
      <div className="h-2 w-2 rounded-full bg-[var(--black)]"></div>
      <div className="h-0.5 flex-1 bg-[var(--black)]" />
    </div>
  );
}
