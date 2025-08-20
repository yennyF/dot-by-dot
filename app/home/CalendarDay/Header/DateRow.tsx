import { MonthType, DayType, useTrackStore } from "@/app/stores/TrackStore";
import { format } from "date-fns";
import DateRowItem from "./DateRowItem";

export default function DateRow() {
  const years = useTrackStore((s) => s.totalDate);

  return (
    <div className="app-DateRow sticky flex bg-[var(--background)]">
      {years.map(([date, months], index) => (
        <YearItem key={index} date={date} months={months} />
      ))}
    </div>
  );
}

interface YearItemProps {
  date: Date;
  months: MonthType[];
}

function YearItem({ date, months }: YearItemProps) {
  return (
    <div className="year-item w-fit">
      <div className="sticky left-0 w-fit px-3 font-bold">
        {format(date, "yyyy")}
      </div>
      <div className="mt-1 flex">
        {months.map(([date, days], index) => (
          <MonthItem key={index} date={date} days={days} />
        ))}
      </div>
    </div>
  );
}

interface MonthItemProps {
  date: Date;
  days: DayType[];
}

function MonthItem({ date, days }: MonthItemProps) {
  return (
    <div className="month-item w-fit">
      <div className="sticky left-0 w-fit px-3 font-bold">
        {format(date, "MMMM")}
      </div>
      <div className="mt-2 flex">
        {days.map((date, index) => (
          <DateRowItem key={index} date={date} />
        ))}
      </div>
    </div>
  );
}
