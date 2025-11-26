import { useTaskLogStore } from "@/app/stores/taskLogStore";
import DateRowItem from "./DateRowItem";

const month_names = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DateRow() {
  const totalDate = useTaskLogStore((s) => s.totalDate);

  return (
    <div className="app-DateRow flex w-fit bg-[var(--background)]">
      {totalDate.map(({ year, months }) => (
        <div key={year} className="flex">
          {months.map(({ month, days }) => (
            <div key={month} className="w-fit min-w-[150px]">
              <div className="sticky left-0 w-fit px-3 font-bold">
                {month_names[month] + " " + year}
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
