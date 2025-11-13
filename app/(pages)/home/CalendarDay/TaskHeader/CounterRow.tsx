"use client";

import { useTaskLogStore } from "@/app/stores/taskLogStore";
import CounterRowItem from "./CounterRowItem";

export default function CounterRow() {
  const totalDate = useTaskLogStore((s) => s.totalDate);

  return (
    <div className="app-CounterRow flex w-fit bg-[var(--background)]">
      {totalDate.map(([, months]) =>
        months.map(([, days]) =>
          days.map((date) => (
            <CounterRowItem key={date.toDateString()} date={date} />
          ))
        )
      )}
    </div>
  );
}
