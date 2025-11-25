"use client";

import { isWeekend } from "date-fns";
import clsx from "clsx";
import AppTooltip from "@/app/components/AppTooltip";

interface TaskItemProps {
  date: Date;
  count: number;
}

export default function GroupDot({ date, count }: TaskItemProps) {
  const isWeekendDate = isWeekend(date);
  const isActive = count > 0;

  // const colorStart = getColor(getPercentage(currentSize, taskIds.length));

  return (
    <AppTooltip.Root delayDuration={100}>
      <AppTooltip.Trigger className="flex shrink-0 cursor-default items-center justify-center">
        <div
          className={clsx(
            "transform rounded-full",
            isActive ? "size-[var(--dot-size)]" : "size-[5px]",
            isActive
              ? "bg-[var(--inverted)]"
              : isWeekendDate
                ? "bg-[var(--gray-5)]"
                : "bg-[var(--gray)]"
          )}
          // style={isActive ? { backgroundColor: colorStart } : undefined}
        />
      </AppTooltip.Trigger>
      <AppTooltip.Content side="top" align="center" sideOffset={10}>
        {count} {count === 1 ? "dot" : "dots"}
      </AppTooltip.Content>
    </AppTooltip.Root>
  );
}

// function getColor(alpha: number) {
//   return `rgba(88, 160, 192, ${alpha})`;
// }
