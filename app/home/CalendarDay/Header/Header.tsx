"use client";

import CounterRow from "./CounterRow";
import DateRow from "./DateRow";

export default function Header() {
  return (
    <div className="App-CalendarHeader w-full bg-[var(--background)]">
      <DateRow />
      <CounterRow />
    </div>
  );
}
