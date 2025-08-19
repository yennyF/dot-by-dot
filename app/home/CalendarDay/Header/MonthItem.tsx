"use client";

import { format } from "date-fns";
import DayItem from "./DayItem";
import { DayType } from "@/app/stores/TrackStore";

interface MonthItemProps {
  date: Date;
  days: DayType[];
}

export default function MonthItem({ date, days }: MonthItemProps) {
  return (
    <div className="month-item w-fit">
      <div className="sticky left-0 w-fit bg-[var(--background)] px-3 font-bold">
        {format(date, "MMMM")}
      </div>
      <div className="days mt-2 flex">
        {days.map((date, index) => (
          <DayItem key={index} date={date} />
        ))}
      </div>
    </div>
  );
}
