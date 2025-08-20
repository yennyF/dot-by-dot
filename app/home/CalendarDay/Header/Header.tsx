"use client";

import { ShadowLeft, ShadowRight, ShadowTop } from "../shadows";
import CounterRow from "./CounterRow";
import DateRow from "./DateRow";

export default function Header() {
  return (
    <div className="calendar-header sticky top-0 z-20 w-fit">
      <div className="f flex items-stretch">
        <ShadowLeft />
        {/* Space to match body space */}
        <div className="w-[30px]" />
        <div>
          <DateRow />
          <CounterRow />
        </div>
        <ShadowRight />
        <div className="sticky right-0 z-10 flex w-name shrink-0 items-end bg-[var(--background)]">
          <CounterRowName />
        </div>
      </div>
      <ShadowTop />
    </div>
  );
}

function CounterRowName() {
  return (
    <div className="flex h-row w-name items-center gap-1.5 pl-5">
      <span className="text-xs text-[var(--gray-9)]">Less </span>
      <div className="size-2.5 rounded-full bg-[var(--green)] opacity-25" />
      <div className="size-2.5 rounded-full bg-[var(--green)] opacity-50" />
      <div className="size-2.5 rounded-full bg-[var(--green)] opacity-75" />
      <div className="size-2.5 rounded-full bg-[var(--green)] opacity-100" />
      <span className="text-xs text-[var(--gray-9)]">More </span>
    </div>
  );
}
