"use client";

import { useGroupStore } from "@/app/stores/groupStore";
import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/taskStore";
import { useUIStore } from "@/app/stores/useUIStore";
import { Group, Task } from "@/app/types";
import { memo } from "react";
import clsx from "clsx";
import { useTaskLogStore } from "@/app/stores/taskLogStore";
import TaskItem from "./TaskItem";
import GroupItem from "./GroupItem";

export default function TaskGrid() {
  const dummyGroup = useGroupStore((s) => s.dummyGroup);
  const groups = useGroupStore((s) => s.groups);

  return (
    <div className="app-Body flex flex-col gap-5">
      <div className="app-group">
        <DummyTask groupId={null} />
        <TaskList groupId={null} />
      </div>

      {dummyGroup && (
        <div className="app-group">
          <GroupRow group={dummyGroup} />
        </div>
      )}

      {groups?.map((group) => (
        <CollapsibleGroup key={group.id} group={group} />
      ))}
    </div>
  );
}

function CollapsibleGroup({ group }: { group: Group }) {
  const open = useUIStore((s) =>
    s.collapsedGroups.includes(group.id) ? false : true
  );

  return (
    <div className="app-group" key={group.id} data-name={group.name}>
      <GroupRow group={group} />
      <DummyTask groupId={group.id} />
      <div className={clsx("overflow-hidden", !open && "h-0")}>
        <TaskList groupId={group.id} />
      </div>
    </div>
  );
}

function DummyTask({ groupId }: { groupId: string | null }) {
  const dummyTask = useTaskStore((s) => {
    return groupId === s.dummyTask?.groupId ? s.dummyTask : null;
  });

  if (!dummyTask) return null;

  return <TaskRow task={dummyTask} />;
}

function TaskListWrapper({ groupId }: { groupId: string | null }) {
  const key = groupId ?? UNGROUPED_KEY;
  const tasks = useTaskStore((s) => s.tasksByGroup?.[key]);

  return (
    <>{tasks?.map((task, index) => <TaskRow task={task} key={index} />)}</>
  );
}
const TaskList = memo(TaskListWrapper);

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

function TaskRowWrapper({ task }: { task: Task }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);

  return (
    <div className="app-TaskList flex">
      {totalDate.map(([, months]) =>
        months.map(([, days]) =>
          days.map((date, index) => (
            <TaskItem key={index} date={date} task={task} />
          ))
        )
      )}
    </div>
  );
}
const TaskRow = memo(TaskRowWrapper);
