import { MonthType, DayType, useTaskLogStore } from "@/app/stores/taskLogStore";
import { format } from "date-fns";
import DateRowItem from "./DateRowItem";

export default function DateRow() {
  const totalDate = useTaskLogStore((s) => s.totalDate);

  return (
    <div className="app-DateRow flex w-fit bg-[var(--background)]">
      {totalDate.map(([date, months], index) => (
        <YearItem key={index} date={date} months={months} />
      ))}
    </div>
  );
}

interface YearItemProps {
  date: Date;
  months: MonthType[];
}

function YearItem({ months }: YearItemProps) {
  return (
    <>
      {months.map(([date, days], index) => (
        <MonthItem key={index} date={date} days={days} />
      ))}
    </>
  );
}

interface MonthItemProps {
  date: Date;
  days: DayType[];
}

function MonthItem({ date, days }: MonthItemProps) {
  return (
    <div className="app-MonthItem w-fit">
      <div className="sticky left-0 w-fit px-3 font-bold">
        {format(date, "MMMM") + " " + format(date, "yyyy")}
      </div>
      <div className="mt-2.5 flex">
        {days.map((date, index) => (
          <DateRowItem key={index} date={date} />
        ))}
      </div>
    </div>
  );
}
