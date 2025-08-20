"use client";

import { useTrackStore } from "@/app/stores/TrackStore";
import { midnightUTCstring } from "@/app/util";
import { CheckIcon } from "@radix-ui/react-icons";
import {
  AppTooltip,
  AppTrigger,
  AppContent,
} from "@/app/components/AppTooltip";
import { isToday } from "date-fns";
import clsx from "clsx";

const MAX_TASK_SIZE = 5;

export default function CounterRowItem({ date }: { date: Date }) {
  const isTodayDate = isToday(date);

  const tasksSize = useTrackStore(
    (s) => s.tasksByDate?.[midnightUTCstring(date)]?.size ?? 0
  );

  // "snap" percentage to the closest step by rounding it to the nearest quarter (25%).
  // 0.13 → 0.25
  // 0.42 → 0.50
  // 0.61 → 0.75
  // 0.88 → 1.00
  const raw = Math.min(tasksSize, MAX_TASK_SIZE) / MAX_TASK_SIZE;
  const step = 0.25; // 25%
  const percentage = Math.round(raw / step) * step;

  return (
    <div className="app-CounterRowItem relative flex w-day items-center justify-center">
      {(isTodayDate || tasksSize > 0) && (
        <AppTooltip>
          <AppTrigger className="flex items-center justify-center">
            <div
              className={clsx(
                "absolute flex size-[var(--dot-size)] transform rounded-full",
                isTodayDate && tasksSize === 0
                  ? "border-[1px] border-[var(--green)]"
                  : "bg-[var(--green)]"
              )}
              style={{
                opacity: isTodayDate && tasksSize === 0 ? 1 : percentage,
              }}
            ></div>
            <CheckIcon className="absolute size-3 text-white" />
          </AppTrigger>
          <AppContent side="top" align="center" sideOffset={10}>
            {tasksSize} dots
          </AppContent>
        </AppTooltip>
      )}
    </div>
  );
}
