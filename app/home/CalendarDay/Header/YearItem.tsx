"use client";

import { format, isBefore, endOfYear, isAfter, startOfYear } from "date-fns";
import { eachMonthOfInterval } from "date-fns/fp";
import MonthItem from "./MonthItem";
import { useTrackStore } from "@/app/stores/TrackStore";

interface YearItemProps {
  date: Date;
}

export default function YearItem({ date }: YearItemProps) {
  const startDate = useTrackStore((s) => s.startDate);
  const endDate = useTrackStore((s) => s.endDate);

  const totalMonths = eachMonthOfInterval({
    start: isAfter(startOfYear(date), startDate)
      ? startOfYear(date)
      : startDate,
    end: isBefore(endOfYear(date), endDate) ? endOfYear(date) : endDate,
  });

  return (
    <div className="year-item w-fit">
      <div
        className="sticky w-fit bg-[var(--background)] px-3 font-bold"
        style={{ left: "var(--width-name)" }}
      >
        {format(date, "yyyy")}
      </div>
      <div className="months mt-1 flex">
        {totalMonths.map((date) => (
          <MonthItem key={date.getMonth()} date={date} />
        ))}
      </div>
    </div>
  );
}
