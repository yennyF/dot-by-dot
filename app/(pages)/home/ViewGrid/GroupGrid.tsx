"use client";

import { useTaskLogStore } from "@/app/stores/taskLogStore";
import GroupDot from "../dots/GroupDot";
import { useTaskStore } from "@/app/stores/taskStore";
import Grid from "./Grid";
import { Group } from "@/app/types";
import { useUIStore } from "@/app/stores/useUIStore";

export default function GroupGrid({ group }: { group: Group }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);
  const setSelectedGroup = useUIStore((s) => s.setSelectedGroup);

  return (
    <Grid.Root
      onClick={() => {
        setSelectedGroup(group.id);
      }}
    >
      <Grid.LabelGroup>{group.name}</Grid.LabelGroup>
      <Grid.Content>
        {totalDate.map(({ months }) =>
          months.map(({ days }) =>
            days.map((date) => (
              <GroupItem
                key={date.toDateString()}
                date={date}
                groupId={group.id}
              />
            ))
          )
        )}
      </Grid.Content>
    </Grid.Root>
  );
}

function GroupItem({ date, groupId }: { date: Date; groupId: string }) {
  const tasks = useTaskStore((s) => s.tasksByGroup[groupId]) || [];
  const count = useTaskLogStore((s) => s.getTasksDone(date, tasks).length);

  return (
    <Grid.Item date={date} isActive={count > 0} isGroup={true}>
      <GroupDot date={date} count={count} />
    </Grid.Item>
  );
}
