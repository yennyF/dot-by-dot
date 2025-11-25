"use client";

import { useGroupStore } from "@/app/stores/groupStore";
import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/taskStore";
import { useUIStore } from "@/app/stores/useUIStore";
import { Group } from "@/app/types";
import clsx from "clsx";
import useClickLog from "@/app/hooks/useClickLog";
import GroupRow from "./GroupRow";
import TaskRow from "./TaskRow";

export default function TaskContent() {
  const dummyGroup = useGroupStore((s) => s.dummyGroup);
  const groups = useGroupStore((s) => s.groups);

  const handleClick = useClickLog();

  return (
    <div className="app-TaskGrid flex flex-col gap-5" onClick={handleClick}>
      <div className="app-group" data-task={"id"}>
        <DummyTask group={null} />
        <TaskList group={null} />
      </div>

      {dummyGroup && (
        <div className="app-group">
          <GroupRow group={dummyGroup} />
        </div>
      )}

      {groups.map((group) => (
        <div className="app-group" key={group.id} data-name={group.name}>
          <CollapsibleGroup key={group.id} group={group} />
        </div>
      ))}
    </div>
  );
}

function CollapsibleGroup({ group }: { group: Group }) {
  const isOpen = useUIStore((s) => (group ? s.isGroupOpen(group.id) : true));

  return (
    <>
      {isOpen ? <div className="h-row" /> : <GroupRow group={group} />}
      <DummyTask group={group} />
      <div className={clsx(isOpen ? "block" : "hidden")}>
        <TaskList group={group} />
      </div>
    </>
  );
}

function TaskList({ group }: { group: Group | null }) {
  const tasks = useTaskStore((s) => s.tasksByGroup[group?.id ?? UNGROUPED_KEY]);

  return (
    <>{tasks?.map((task) => <TaskRow taskId={task.id} key={task.id} />)}</>
  );
}

function DummyTask({ group }: { group: Group | null }) {
  const dummyTask = useTaskStore((s) => {
    if (!s.dummyTask) return null;
    if (group) return s.dummyTask.groupId === group.id ? s.dummyTask : null;
    return s.dummyTask.groupId === null ? s.dummyTask : null;
  });

  if (!dummyTask) return null;

  return <TaskRow taskId={dummyTask.id} />;
}
