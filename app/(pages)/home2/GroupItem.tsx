import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { useTaskStore } from "@/app/stores/taskStore";
import clsx from "clsx";
import styles from "./dot.module.scss";
import AppTooltip from "@/app/components/AppTooltip";

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

  return (
    <div className={"relative flex h-row w-day items-center justify-center"}>
      <AppTooltip.Root delayDuration={100}>
        <AppTooltip.Trigger
          className="flex cursor-default items-center justify-center"
          asChild
        >
          <div
            data-active={isActive}
            className={clsx(
              styles.dot,
              "size-[var(--dot-size)] transform rounded-full",
              isActive ? "bg-[var(--inverted)]" : "bg-[var(--gray-5)]"
            )}
            // style={isActive ? { backgroundColor: colorStart } : undefined}
          >
            <span className={styles.date}>{date.getDate()}</span>
          </div>
        </AppTooltip.Trigger>
        <AppTooltip.ContentNonPortal
          side="bottom"
          align="center"
          sideOffset={10}
        >
          {currentSize} {currentSize === 1 ? "dot" : "dots"}
        </AppTooltip.ContentNonPortal>
      </AppTooltip.Root>
    </div>
  );
}

// function getColor(alpha: number) {
//   return `rgba(88, 160, 192, ${alpha})`;
// }
