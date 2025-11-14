import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { format } from "date-fns";
import DateRowItem from "./DateRowItem";

export default function DateRow() {
  const totalDate = useTaskLogStore((s) => s.totalDate);

  return (
    <div className="app-DateRow flex w-fit bg-[var(--background)]">
      {totalDate.map(([date, months]) => (
        <div key={date.getFullYear()} className="flex">
          {months.map(([date, days]) => (
            <div key={date.getMonth()} className="w-fit min-w-[150px]">
              <div className="sticky left-0 w-fit px-3 font-bold">
                {format(date, "MMMM") + " " + format(date, "yyyy")}
              </div>
              <div className="mt-2.5 flex">
                {days.map((date) => (
                  <DateRowItem key={date.toDateString()} date={date} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
