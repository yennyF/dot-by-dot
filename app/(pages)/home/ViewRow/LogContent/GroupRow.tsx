import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { Group } from "@/app/types";
import { memo } from "react";
import { useTaskStore } from "@/app/stores/taskStore";
import { addDays } from "date-fns";
import GroupDot from "../../dots/GroupDot";
import Row from "./Row";

function GroupRowWrapper({ group }: { group: Group }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);

  return (
    <Row.Root>
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
    </Row.Root>
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
    <Row.Item
      isActive={isActive}
      isNextActive={isNextActive}
      color="bg-[var(--inverted-5)]"
    >
      <GroupDot date={date} count={count} />
    </Row.Item>
  );
}
