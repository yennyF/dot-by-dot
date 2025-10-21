"use client";

import { Group } from "@/app/types";
import { memo } from "react";
import { useTaskLogStore } from "@/app/stores/taskLogStore";
import GroupItem from "./GroupItem";

function GroupRowWrapper({ group }: { group: Group }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);

  return (
    <div className="app-GroupRow flex">
      {totalDate.map(([, months]) =>
        months.map(([, days]) =>
          days.map((date, index) => (
            <GroupItem key={index} date={date} group={group} />
          ))
        )
      )}
    </div>
  );
}
const GroupRow = memo(GroupRowWrapper);
export default GroupRow;
