"use client";

import YearItem from "./YearItem";
import { useTrackStore } from "@/app/stores/TrackStore";
import { ShadowLeft, ShadowRight, ShadowTop } from "../shadows";

export default function Header() {
  const years = useTrackStore((s) => s.totalDate);

  return (
    <div className="calendar-header sticky top-0 z-20 w-fit">
      <div className="flex items-stretch">
        <ShadowLeft />
        {/* Space to match body space */}
        <div className="w-[30px]" />
        <div className="sticky flex bg-[var(--background)]">
          {years.map(([date, months], index) => (
            <YearItem key={index} date={date} months={months} />
          ))}
        </div>
        <ShadowRight />
        <div className="sticky right-0 z-10 flex w-name shrink-0 bg-[var(--background)]" />
      </div>
      <ShadowTop />
    </div>
  );
}
