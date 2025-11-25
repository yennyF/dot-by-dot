"use client";

import { useTaskLogStore } from "@/app/stores/taskLogStore";
import styles from "./styles.module.scss";
import GroupDot from "../dots/GroupDot";
import { useTaskStore } from "@/app/stores/taskStore";
import GridHeader from "./GridHeader";

export default function GroupGrid({ groupId }: { groupId: string }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);
  const paddingDays = useTaskLogStore((s) => s.paddingDays);

  return (
    <div className={styles.grid}>
      <GridHeader />
      <div className={styles.log}>
        {paddingDays.map((day) => (
          <div key={day.toDateString()} className="size-[var(--dot-size)]" />
        ))}
        {totalDate.map(({ months }) =>
          months.map(({ days }) =>
            days.map((date) => (
              <GroupItem
                key={date.toDateString()}
                date={date}
                groupId={groupId}
              />
            ))
          )
        )}
      </div>
    </div>
  );
}

function GroupItem({ date, groupId }: { date: Date; groupId: string }) {
  const tasks = useTaskStore((s) => s.tasksByGroup[groupId]) || [];
  const count = useTaskLogStore((s) => s.getTasksDone(date, tasks).length);

  return (
    <div className={"relative flex items-center justify-center"}>
      <GroupDot date={date} count={count} />
      <span className={styles.date}>{date.getDate()}</span>
    </div>
  );
}
