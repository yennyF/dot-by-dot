import {
  AppTooltip,
  AppTooltipTrigger,
  AppContentTrigger,
} from "@/app/components/AppTooltip";
import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { useTaskStore } from "@/app/stores/taskStore";
import clsx from "clsx";
import { isWeekend } from "date-fns";
import styles from "./dot.module.scss";

interface GroupItemProps {
  date: Date;
  groupId: string;
}

export default function GroupItem({ date, groupId }: GroupItemProps) {
  const tasks = useTaskStore((s) => s.tasksByGroup[groupId]) || [];

  const currentSize = useTaskLogStore(
    (s) => s.getTasksDone(date, tasks).length
  );
  const isActive = currentSize > 0;

  // const colorStart = getColor(
  //   getPercentage(currentSize, Math.min(tasks.length, 3))
  // );
  // const colorEnd = getColor(getPercentage(nextSize, taskIds.length));

  // const isTodayDate = isToday(date);
  const isWeekendDate = isWeekend(date);

  return (
    <div className={"relative flex h-row w-day items-center justify-center"}>
      <span className={styles.date}>{date.getDate()}</span>

      <AppTooltip delayDuration={100}>
        <AppTooltipTrigger
          className="flex cursor-default items-center justify-center"
          asChild
        >
          <div
            data-active={isActive}
            className={clsx(
              styles.dot,
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
        <AppContentTrigger side="bottom" align="center" sideOffset={10}>
          {currentSize} {currentSize === 1 ? "dot" : "dots"}
        </AppContentTrigger>
      </AppTooltip>
    </div>
  );
}

// function getColor(alpha: number) {
//   return `rgba(88, 160, 192, ${alpha})`;
// }
