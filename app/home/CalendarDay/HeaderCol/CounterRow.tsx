"use client";

import { DayType, MonthType, useTaskLogStore } from "@/app/stores/taskLogStore";
import CounterRowItem from "./CounterRowItem";

export default function CounterRow() {
  const years = useTaskLogStore((s) => s.totalDate);

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
    <>
      {months.map(([, days], index) => (
        <MonthItem key={index} days={days} />
      ))}
    </>
  );
}

function MonthItem({ days }: { days: DayType[] }) {
  return (
    <>
      {days.map((date, index) => (
        <CounterRowItem key={index} date={date} />
      ))}
    </>
  );
}
