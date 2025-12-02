import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { useScrollStore } from "@/app/stores/scrollStore";
import clsx from "clsx";
import { format, isToday, isWeekend } from "date-fns";
import { useEffect } from "react";

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

function DateRowItem({ date }: { date: Date }) {
  const isTodayDate = isToday(date);
  const dateFormatted = format(date, "EE");

  const todayRef = useScrollStore((s) => (isTodayDate ? s.todayRef : null));

  // Scroll to "today" the first it loads
  useEffect(() => {
    if (todayRef) {
      requestAnimationFrame(() => {
        todayRef.current?.scrollIntoView({
          block: "end",
          // behavior: "smooth",
          inline: "start",
        });
      });
    }
  }, [todayRef]);

  return (
    <div
      ref={isTodayDate ? todayRef : undefined}
      className={clsx(
        "day-item flex w-[var(--width-row-view)] flex-col items-center",
        isTodayDate && "isToday text-[var(--accent)]",
        isWeekend(date)
          ? "text-[var(--color-name-weekend)]"
          : "text-[var(--black)]"
      )}
    >
      <div className="text-center text-xs">
        {dateFormatted[0] + dateFormatted[1]}
      </div>
      <div
        className={clsx(
          "flex h-[28px] w-[28px] items-center justify-center font-bold",
          isTodayDate && "rounded-full bg-[var(--accent)] text-white"
        )}
      >
        {format(date, "dd")}
      </div>
    </div>
  );
}
