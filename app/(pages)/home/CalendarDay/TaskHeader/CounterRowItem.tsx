"use client";

import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { getSnappedPercentage } from "@/app/utils/utils";
import AppTooltip from "@/app/components/AppTooltip";
import { addDays, isToday } from "date-fns";
import clsx from "clsx";
import { toApiDate } from "@/app/types";

export default function CounterRowItem({ date }: { date: Date }) {
  const currentSize = useTaskLogStore(
    (s) => s.tasksByDate[toApiDate(date)]?.size ?? 0
  );
  const nextSize = useTaskLogStore(
    (s) => s.tasksByDate[toApiDate(addDays(date, 1))]?.size ?? 0
  );

  const isCurrentActive = currentSize > 0;
  const isNextActive = nextSize > 0;

  const colorStart = getColor(getSnappedPercentage(currentSize));
  const colorEnd = getColor(getSnappedPercentage(nextSize));

  const isTodayDate = isToday(date);

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
      <AppTooltip.Root delayDuration={100}>
        <AppTooltip.Trigger className="flex cursor-default items-center justify-center">
          <div
            className={clsx(
              "transform rounded-full",
              isCurrentActive
                ? "size-[10px] bg-[var(--green)]"
                : "size-[4px] bg-[var(--gray)]"
            )}
            style={
              isCurrentActive ? { backgroundColor: colorStart } : undefined
            }
          />
        </AppTooltip.Trigger>
        <AppTooltip.Content side="top" align="center" sideOffset={10}>
          {currentSize} {currentSize === 1 ? "dot" : "dots"}
        </AppTooltip.Content>
      </AppTooltip.Root>
    </div>
  );
}

function getColor(alpha: number) {
  return `rgba(88, 192, 120, ${alpha})`;
}
