"use client";

import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { Group, toApiDate } from "@/app/types";
import { addDays, isToday, isWeekend } from "date-fns";
import clsx from "clsx";
// import { getPercentage } from "@/app/utils/utils";
import { useTaskStore } from "@/app/stores/taskStore";
import {
  AppContentTrigger,
  AppTooltip,
  AppTooltipTrigger,
} from "@/app/components/AppTooltip";

interface GroupItemProps {
  date: Date;
  group: Group;
}

export default function GroupItem({ date, group }: GroupItemProps) {
  const isTodayDate = isToday(date);
  const isWeekendDate = isWeekend(date);

  const taskIds = useTaskStore((s) => s.tasksByGroup[group.id]) || [];
  const taskIdSet = new Set(taskIds);

  const currentKey = toApiDate(date);
  const nextKey = toApiDate(addDays(date, 1));

  const currentSize = useTaskLogStore(
    (s) => s.tasksByDate[currentKey]?.intersection(taskIdSet).size ?? 0
  );
  const nextSize = useTaskLogStore(
    (s) => s.tasksByDate[nextKey]?.intersection(taskIdSet).size ?? 0
  );

  const isActive = currentSize > 0;
  const isNextActive = nextSize > 0;

  // const colorStart = getColor(getPercentage(currentSize, tasks.length));
  // const colorEnd = getColor(getPercentage(nextSize, tasks.length));

  return (
    <div
      className={clsx(
        "app-GroupRowItem relative flex h-row w-day items-center justify-center",
        isTodayDate && "isToday"
      )}
    >
      {isActive && isNextActive && (
        <div
          className="absolute left-[calc(50%-7px)] right-[calc(-50%-7px)] h-[var(--dot-size)] animate-fade-in rounded-full bg-[var(--inverted-5)]"
          // style={{
          //   background: `linear-gradient(to right, ${colorStart}, ${colorEnd})`,
          // }}
        />
      )}
      <AppTooltip delayDuration={100}>
        <AppTooltipTrigger className="flex cursor-default items-center justify-center">
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
        </AppTooltipTrigger>
        <AppContentTrigger side="top" align="center" sideOffset={10}>
          {currentSize} {currentSize === 1 ? "dot" : "dots"}
        </AppContentTrigger>
      </AppTooltip>
    </div>
  );
}

// function getColor(alpha: number) {
//   return `rgba(88, 160, 192, ${alpha})`;
// }
