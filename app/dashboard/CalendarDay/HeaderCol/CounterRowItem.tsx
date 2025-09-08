"use client";

import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { getSnappedPercentage } from "@/app/utils/utils";
import {
  AppTooltip,
  AppTrigger,
  AppContent,
} from "@/app/components/AppTooltip";
import { addDays, isToday } from "date-fns";
import clsx from "clsx";
import { toApiDate } from "@/app/types";

export default function CounterRowItem({ date }: { date: Date }) {
  const isTodayDate = isToday(date);

  const currentKey = toApiDate(date);
  const nextKey = toApiDate(addDays(date, 1));

  const currentSize = useTaskLogStore(
    (s) => s.tasksByDate?.[currentKey]?.size ?? 0
  );
  const nextSize = useTaskLogStore((s) => s.tasksByDate?.[nextKey]?.size ?? 0);

  const isCurrentActive = currentSize > 0;
  const isNextActive = nextSize > 0;

  const colorStart = getColor(getSnappedPercentage(currentSize));
  const colorEnd = getColor(getSnappedPercentage(nextSize));

  return (
    <div
      className={clsx(
        "app-CounterRowItem relative flex h-row w-day items-center justify-center",
        isTodayDate && "isToday"
      )}
    >
      {isCurrentActive && isNextActive && (
        <div
          className="absolute left-[calc(50%+5px)] right-[calc(-50%+5px)] h-[1px] animate-fade-in"
          style={{
            background: `linear-gradient(to right, ${colorStart}, ${colorEnd})`,
          }}
        />
      )}
      {(isCurrentActive || isTodayDate) && (
        <AppTooltip>
          <AppTrigger className="flex cursor-default items-center justify-center">
            <div
              className={clsx(
                "size-[10px] transform rounded-full",
                isTodayDate && "border-[1px] border-[var(--green)]"
              )}
              style={{ backgroundColor: colorStart }}
            />
          </AppTrigger>
          <AppContent side="top" align="center" sideOffset={10}>
            {currentSize} dots
          </AppContent>
        </AppTooltip>
      )}
    </div>
  );
}

function getColor(alpha: number) {
  return `rgba(88, 192, 120, ${alpha})`;
}
