"use client";

import YearItem from "./YearItem";
import { useTrackStore } from "@/app/stores/TrackStore";
import { eachYearOfInterval } from "date-fns";

export default function Header() {
  const startDate = useTrackStore((s) => s.startDate);
  const endDate = useTrackStore((s) => s.endDate);

  const totalYears = eachYearOfInterval({
    start: startDate,
    end: endDate,
  });

  return (
    <div className="calendar-header sticky top-[70px] z-10 flex w-fit">
      <div
        className="sticky left-0 z-20 flex shrink-0 bg-[var(--background)]"
        style={{ width: "var(--width-name)" }}
      />
      <div
        className="sticky flex bg-[var(--background)]"
        style={{ left: "var(--width-name)" }}
      >
        {totalYears.map((date) => (
          <YearItem key={date.getFullYear()} date={date} />
        ))}
      </div>
    </div>
  );
}
