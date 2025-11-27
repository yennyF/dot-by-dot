"use client";

import { useTaskLogStore } from "@/app/stores/taskLogStore";
import GroupDot from "../dots/GroupDot";
import { useTaskStore } from "@/app/stores/taskStore";
import Grid from "./Grid";
import { Group } from "@/app/types";

export default function GroupGrid({ group }: { group: Group }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);

  return (
    <Grid.Root>
      <Grid.LabelGroup>{group.name}</Grid.LabelGroup>
      <Grid.Content>
        {totalDate.map(({ months }) =>
          months.map(({ days }) =>
            days.map((date) => (
              <Grid.Item key={date.toDateString()} date={date}>
                <GroupItem date={date} groupId={group.id} />
              </Grid.Item>
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

  return <GroupDot date={date} count={count} />;
}
