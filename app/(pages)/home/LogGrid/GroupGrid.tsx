"use client";

import { useTaskLogStore } from "@/app/stores/taskLogStore";
import GroupItem from "./GroupItem";
import styles from "./dot.module.scss";

export default function GroupGrid({ groupId }: { groupId: string }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);
  const paddingDays = useTaskLogStore((s) => s.paddingDays);

  return (
    <div className={styles.log}>
      {paddingDays.map((_, index) => (
        <div key={index} className="h-row w-day" />
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
  );
}
