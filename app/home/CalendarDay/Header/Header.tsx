"use client";

import YearItem from "./YearItem";
import { useTrackStore } from "@/app/stores/TrackStore";
import { eachYearOfInterval } from "date-fns";
import { ShadowLeft, ShadowRight, ShadowTop } from "../shadows";
import { useShallow } from "zustand/react/shallow";

export default function Header() {
  const { startDate, endDate } = useTrackStore(
    useShallow((s) => ({
      startDate: s.startDate,
      endDate: s.endDate,
    }))
  );

  const totalYears = eachYearOfInterval({
    start: startDate,
    end: endDate,
  });

  return (
    <div className="calendar-header sticky top-0 z-20 w-fit">
      <div className="flex items-stretch">
        <div className="sticky left-0 z-10 flex w-name shrink-0 bg-[var(--background)]" />
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
