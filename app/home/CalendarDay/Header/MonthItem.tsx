"use client";

import {
  format,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
  isBefore,
  isAfter,
} from "date-fns";
import DayItem from "./DayItem";
import { useTrackStore } from "@/app/stores/TrackStore";
import { useShallow } from "zustand/react/shallow";

interface MonthItemProps {
  date: Date;
}

export default function MonthItem({ date }: MonthItemProps) {
  const { startDate, endDate } = useTrackStore(
    useShallow((s) => ({
      startDate: s.startDate,
      endDate: s.endDate,
    }))
  );

  const totalDays = eachDayOfInterval({
    start: isAfter(startOfMonth(date), startDate)
      ? startOfMonth(date)
      : startDate,
    end: isBefore(endOfMonth(date), endDate) ? endOfMonth(date) : endDate,
  });

  return (
    <div className="month-item w-fit">
      <div className="sticky left-name w-fit bg-[var(--background)] px-[14px] font-bold">
        {format(date, "MMMM")}
      </div>
      <div className="days mt-2 flex">
        {totalDays.map((date) => (
          <DayItem key={date.toLocaleDateString()} date={date} />
        ))}
      </div>
    </div>
  );
}
