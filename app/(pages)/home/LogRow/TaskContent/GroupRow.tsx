import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { Group } from "@/app/types";
import { memo } from "react";
import { useTaskStore } from "@/app/stores/taskStore";
import clsx from "clsx";
import { addDays } from "date-fns";
import GroupDot from "../../dots/GroupDot";

function GroupRowWrapper({ group }: { group: Group }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);

  return (
    <div className="app-GroupRow flex">
      {totalDate.map(({ year, months }) =>
        months.map(({ month, days }) => (
          <div key={`${year}-${month}`} className="flex min-w-[150px]">
            {days.map((date) => (
              <GroupItem
                key={date.toDateString()}
                date={date}
                groupId={group.id}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
const GroupRow = memo(GroupRowWrapper);
export default GroupRow;

function GroupItem({ date, groupId }: { date: Date; groupId: string }) {
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
