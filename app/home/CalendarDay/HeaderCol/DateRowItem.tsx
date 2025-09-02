import { useScrollStore } from "@/app/stores/scrollStore";
import clsx from "clsx";
import { format, isToday, isWeekend } from "date-fns";
import { useEffect } from "react";

interface DayItemProps {
  date: Date;
}

export default function DateRowItem({ date }: DayItemProps) {
  const isTodayDate = isToday(date);
  const dateFormatted = format(date, "EE");

  const todayRef = useScrollStore((s) => (isTodayDate ? s.todayRef : null));

  // Scroll to "today" the first it loads
  useEffect(() => {
    if (todayRef) {
      requestAnimationFrame(() => {
        todayRef.current?.scrollIntoView({
          block: "end",
          behavior: "smooth",
          inline: "start",
        });
      });
    }
  }, [todayRef]);

  return (
    <div
      ref={isTodayDate ? todayRef : undefined}
      className={clsx(
        "day-item flex w-day flex-col items-center",
        isTodayDate && "isToday text-[var(--accent)]",
        isWeekend(date) && "text-[var(--inverted)]"
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
