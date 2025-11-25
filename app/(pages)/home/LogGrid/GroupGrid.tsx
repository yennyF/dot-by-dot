"use client";

import { useTaskLogStore } from "@/app/stores/taskLogStore";
import GroupDot from "../dots/GroupDot";
import { useTaskStore } from "@/app/stores/taskStore";
import { useUIStore } from "@/app/stores/useUIStore";
import DotGrid from "./DotGrid";
import { Group } from "@/app/types";

export default function GroupGrid({ group }: { group: Group }) {
  const setSelectedGroup = useUIStore((s) => s.setSelectedGroup);
  const totalDate = useTaskLogStore((s) => s.totalDate);

  return (
    <DotGrid.Root>
      <DotGrid.LabelGroup onClick={() => setSelectedGroup(group)}>
        {group.name}
      </DotGrid.LabelGroup>
      <DotGrid.Content>
        {totalDate.map(({ months }) =>
          months.map(({ days }) =>
            days.map((date) => (
              <DotGrid.Item key={date.toDateString()} date={date}>
                <GroupItem date={date} groupId={group.id} />
              </DotGrid.Item>
            ))
          )
        )}
      </DotGrid.Content>
    </DotGrid.Root>
  );
}

function GroupItem({ date, groupId }: { date: Date; groupId: string }) {
  const tasks = useTaskStore((s) => s.tasksByGroup[groupId]) || [];
  const count = useTaskLogStore((s) => s.getTasksDone(date, tasks).length);

  return <GroupDot date={date} count={count} />;
}
