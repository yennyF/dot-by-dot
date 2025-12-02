"use client";

import { isWeekend } from "date-fns";
import clsx from "clsx";
import { Tooltip } from "radix-ui";
import stylesTooltip from "@/app/styles/tooltip.module.scss";

interface GroupDotProps {
  date: Date;
  count: number;
}

export default function GroupDot({ date, count }: GroupDotProps) {
  const isWeekendDate = isWeekend(date);
  const isActive = count > 0;

  // const colorStart = getColor(getPercentage(currentSize, taskIds.length));

  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger className="flex size-[var(--size-dot)] shrink-0 cursor-default items-center justify-center">
          <div
            className={clsx(
              "transform rounded-full",
              isActive ? "size-[var(--size-dot)]" : "size-[6px]",
              isActive
                ? "bg-[var(--inverted)]"
                : isWeekendDate
                  ? "bg-[var(--color-dot-2)]"
                  : "bg-[var(--color-dot-1)]"
            )}
            // style={isActive ? { backgroundColor: colorStart } : undefined}
          />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={stylesTooltip.content}
            side="top"
            align="center"
            sideOffset={10}
          >
            {count} {count === 1 ? "dot" : "dots"}
            <Tooltip.Arrow className={stylesTooltip.arrow} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

// function getColor(alpha: number) {
//   return `rgba(88, 160, 192, ${alpha})`;
// }
