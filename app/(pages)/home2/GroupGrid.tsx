"use client";

import { useTaskLogStore } from "@/app/stores/taskLogStore";
import GroupItem from "./GroupItem";
import styles from "./dot.module.scss";

export default function GroupGrid({ groupId }: { groupId: string }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);

  const ghostCount = totalDate[0][0].getDay();
  const pad = Array(ghostCount).fill(null).concat(ghostCount);

  return (
    <div className={styles.log}>
      {pad.map((_, index) => (
        <div key={index} className="h-row w-day"></div>
      ))}
      {totalDate.map(([, months]) =>
        months.map(([, days]) =>
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
