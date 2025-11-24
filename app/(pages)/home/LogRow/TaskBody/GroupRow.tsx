import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { Group } from "@/app/types";
import { memo } from "react";
import GroupItem from "./GroupItem";

function GroupRowWrapper({ group }: { group: Group }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);

  return (
    <div className="app-GroupRow flex">
      {totalDate.map(([, months]) =>
        months.map(([date, days]) => (
          <div key={date.toDateString()} className="flex min-w-[150px]">
            {days.map((date) => (
              <GroupItem key={date.toDateString()} date={date} group={group} />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
const GroupRow = memo(GroupRowWrapper);
export default GroupRow;
