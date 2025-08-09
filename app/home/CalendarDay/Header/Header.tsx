"use client";

import YearItem from "./YearItem";
import { useTrackStore } from "@/app/stores/TrackStore";
import { eachYearOfInterval } from "date-fns";
import { ShadowLeft, ShadowRight, ShadowTop } from "../shadows";

export default function Header() {
  const startDate = useTrackStore((s) => s.startDate);
  const endDate = useTrackStore((s) => s.endDate);

  const totalYears = eachYearOfInterval({
    start: startDate,
    end: endDate,
  });

  return (
    <div className="calendar-header sticky top-0 z-20 w-fit">
      <div className="flex items-stretch">
        <div
          className="sticky left-0 z-10 flex shrink-0 bg-[var(--background)]"
          style={{ width: "var(--width-name)" }}
        />
        <ShadowLeft />
        <div className="sticky flex bg-[var(--background)]">
          {totalYears.map((date) => (
            <YearItem key={date.getFullYear()} date={date} />
          ))}
        </div>
        <ShadowRight />
      </div>
      <ShadowTop />
    </div>
  );
}
