"use client";

import { DayType, MonthType, useTrackStore } from "@/app/stores/TrackStore";
import CounterRowItem from "./CounterRowItem";

export default function CounterRow() {
  const years = useTrackStore((s) => s.totalDate);

  return (
    <div className="app-CounterRow flex w-fit bg-[var(--background)]">
      {years.map(([, months], index) => (
        <YearItem key={index} months={months} />
      ))}
    </div>
  );
}

function YearItem({ months }: { months: MonthType[] }) {
  return (
    <div className="flex">
      {months.map(([, days], index) => (
        <MonthItem key={index} days={days} />
      ))}
    </div>
  );
}

function MonthItem({ days }: { days: DayType[] }) {
  return (
    <div className="flex">
      {days.map((date, index) => (
        <CounterRowItem key={index} date={date} />
      ))}
    </div>
  );
}
