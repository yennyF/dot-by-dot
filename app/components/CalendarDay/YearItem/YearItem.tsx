"use client";

import { format, isBefore, endOfYear, isAfter, startOfYear } from "date-fns";
import { eachMonthOfInterval } from "date-fns/fp";
import MonthItem from "./MonthItem";
import { use } from "react";
import { AppContext } from "@/app/AppContext";

interface YearItemProps {
  date: Date;
}

export default function YearItem({ date }: YearItemProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("YearItem must be used within a AppProvider");
  }
  const { minDate, maxDate } = appContext;

  const totalMonths = eachMonthOfInterval({
    start: isAfter(startOfYear(date), minDate) ? startOfYear(date) : minDate,
    end: isBefore(endOfYear(date), maxDate) ? endOfYear(date) : maxDate,
  });

  return (
    <div className="year-item w-fit">
      <div className="sticky left-[250px] w-fit bg-[var(--background)] pl-3 pr-3 text-2xl font-bold">
        {format(date, "yyyy")}
      </div>
      <div className="months mt-3 flex">
        {totalMonths.map((date) => (
          <MonthItem key={date.getMonth()} date={date} />
        ))}
      </div>
    </div>
  );
}
