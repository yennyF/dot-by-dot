"use client";

import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { addDays } from "date-fns";
import clsx from "clsx";
import { useTaskStore } from "@/app/stores/taskStore";
import GroupDot from "../../dots/GroupDot";

interface GroupItemProps {
  date: Date;
  groupId: string;
}

export default function GroupItem({ date, groupId }: GroupItemProps) {
  const tasks = useTaskStore((s) => s.tasksByGroup[groupId]) || [];

  const count = useTaskLogStore((s) => s.getTasksDone(date, tasks).length);
  const nextCount = useTaskLogStore(
    (s) => s.getTasksDone(addDays(date, 1), tasks).length
  );

  const isActive = count > 0;
  const isNextActive = nextCount > 0;

  return (
    <div
      className={clsx(
        "app-GroupRowItem relative flex h-row w-day items-center justify-center"
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
      <GroupDot date={date} count={count} />
    </div>
  );
}
