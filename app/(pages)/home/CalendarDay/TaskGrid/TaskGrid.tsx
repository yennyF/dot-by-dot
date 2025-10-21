"use client";

import { useGroupStore } from "@/app/stores/groupStore";
import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/taskStore";
import { useUIStore } from "@/app/stores/useUIStore";
import { Group } from "@/app/types";
import clsx from "clsx";
import GroupRow from "./GroupRow";
import TaskRow from "./TaskRow";
import { memo } from "react";
import { useTaskLogStore } from "@/app/stores/taskLogStore";

export default function TaskGrid() {
  const dummyGroup = useGroupStore((s) => s.dummyGroup);
  const groups = useGroupStore((s) => s.groups);

  const lock = useTaskLogStore((s) => s.lock);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const index = (e.target as HTMLElement).dataset.index;
    console.log(index);
    // if (index !== undefined) onToggle(Number(index));
  }

  return (
    <div
      className={clsx("app-Body flex flex-col gap-5", lock ? "lock" : "unlock")}
      onClick={handleClick}
    >
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
      <div className={clsx(open ? "block" : "hidden")}>
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

  return <>{tasks?.map((task) => <TaskRow task={task} key={task.id} />)}</>;
}
const TaskList = memo(TaskListWrapper);
