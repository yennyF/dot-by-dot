"use client";

import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { Group } from "@/app/repositories/types";
import { addDays, isToday } from "date-fns";
import clsx from "clsx";
import { getPercentage, midnightUTCstring } from "@/app/util";
import { useTaskStore } from "@/app/stores/TaskStore";

interface GroupRowItemProps {
  date: Date;
  group: Group;
}

export default function GroupRowItem({ date, group }: GroupRowItemProps) {
  const isTodayDate = isToday(date);

  const tasks = useTaskStore((s) => s.tasksByGroup?.[group.id]) || [];
  const taskIdSet = new Set(tasks.map((t) => t.id));

  const currentKey = midnightUTCstring(date);
  const nextKey = midnightUTCstring(addDays(date, 1));

  const currentSize = useTaskLogStore(
    (s) => s.tasksByDate?.[currentKey]?.intersection(taskIdSet).size ?? 0
  );
  const nextSize = useTaskLogStore(
    (s) => s.tasksByDate?.[nextKey]?.intersection(taskIdSet).size ?? 0
  );

  const isCurrentActive = currentSize > 0;
  const isNextActive = nextSize > 0;

  const colorStart = getColor(getPercentage(currentSize, tasks.length));
  const colorEnd = getColor(getPercentage(nextSize, tasks.length));

  return (
    <div
      className={clsx(
        "app-GroupRowItem relative flex h-row w-day items-center justify-center",
        isTodayDate && "isToday"
      )}
    >
      {isCurrentActive && isNextActive && (
        <div
          className="absolute left-[calc(50%+3px)] right-[calc(-50%+3px)] h-[1px] animate-fade-in"
          style={{
            background: `linear-gradient(to right, ${colorStart}, ${colorEnd})`,
          }}
        />
      )}
      {(isCurrentActive || isTodayDate) && (
        <div
          className={clsx(
            "size-[6px] transform rounded-full",
            isTodayDate && "border-[1px] border-[var(--accent)]"
          )}
          style={{ backgroundColor: colorStart }}
        />
      )}
    </div>
  );
}

function getColor(alpha: number) {
  return `rgba(192, 120, 88, ${alpha})`;
}
