"use client";

import { format } from "date-fns";
import MonthItem from "./MonthItem";
import { MonthType } from "@/app/stores/TrackStore";

interface YearItemProps {
  date: Date;
  months: MonthType[];
}

export default function YearItem({ date, months }: YearItemProps) {
  return (
    <div className="year-item w-fit">
      <div className="sticky left-0 w-fit bg-[var(--background)] px-3 font-bold">
        {format(date, "yyyy")}
      </div>
      <div className="months mt-1 flex">
        {months.map(([date, days], index) => (
          <MonthItem key={index} date={date} days={days} />
        ))}
      </div>
    </div>
  );
}
