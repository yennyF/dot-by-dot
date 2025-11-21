import {
  AppTooltip,
  AppTooltipTrigger,
  AppContentTrigger,
} from "@/app/components/AppTooltip";
import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { useTaskStore } from "@/app/stores/taskStore";
import { Group } from "@/app/types";
import clsx from "clsx";
import { isToday, isWeekend } from "date-fns";

interface GroupItemProps {
  date: Date;
  group: Group;
}

export default function GroupItem({ date, group }: GroupItemProps) {
  const tasks = useTaskStore((s) => s.tasksByGroup[group.id]) || [];

  const currentSize = useTaskLogStore(
    (s) => s.getTasksDone(date, tasks).length
  );
  const isActive = currentSize > 0;

  // const colorStart = getColor(
  //   getPercentage(currentSize, Math.min(tasks.length, 3))
  // );
  // const colorEnd = getColor(getPercentage(nextSize, taskIds.length));

  const isTodayDate = isToday(date);
  const isWeekendDate = isWeekend(date);

  return (
    <div
      className={clsx(
        "app-GroupRowItem relative flex h-row w-day items-center justify-center",
        isTodayDate && "isToday"
      )}
    >
      <AppTooltip delayDuration={100}>
        <AppTooltipTrigger className="flex cursor-default items-center justify-center">
          <div
            className={clsx(
              "size-[var(--dot-size)] transform rounded-full",
              isActive
                ? "bg-[var(--inverted)]"
                : isWeekendDate
                  ? "bg-[var(--gray-5)]"
                  : "bg-[var(--gray-5)]"
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

function getColor(alpha: number) {
  return `rgba(88, 160, 192, ${alpha})`;
}
