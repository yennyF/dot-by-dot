"use client";

import { useGroupStore } from "@/app/stores/groupStore";
import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/taskStore";
import { useUIStore } from "@/app/stores/useUIStore";
import { Group } from "@/app/types";
import clsx from "clsx";
import GroupRow from "./GroupRow";
import TaskRow from "./TaskRow";
import { useTaskLogStore } from "@/app/stores/taskLogStore";

export default function TaskGrid() {
  const dummyGroup = useGroupStore((s) => s.dummyGroup);
  const groups = useGroupStore((s) => s.groups);

  const insertTaskLog = useTaskLogStore((s) => s.insertTaskLog);
  const deleteTaskLog = useTaskLogStore((s) => s.deleteTaskLog);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const element = (e.target as HTMLElement).closest("[data-task-id]");
    if (!element) return;

    const htmlElement = element as HTMLElement;
    const taskId = htmlElement.dataset["taskId"];
    const date = htmlElement.dataset["date"];
    const active = htmlElement.dataset["active"];

    if (!taskId || !date || active === undefined) return;

    if (active === "true") {
      deleteTaskLog(new Date(date), taskId);
    } else {
      insertTaskLog(new Date(date), taskId);
    }
  }

  return (
    <div className="app-TaskGrid flex flex-col gap-5" onClick={handleClick}>
      <div className="app-group" data-task={"id"}>
        <DummyTask groupId={null} />
        <TaskList groupId={null} />
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
  const isOpen = useUIStore((s) => s.isGroupOpen(group.id));

  return (
    <>
      {isOpen ? <div className="h-row" /> : <GroupRow group={group} />}
      <DummyTask groupId={group.id} />
      <div className={clsx(isOpen ? "block" : "hidden")}>
        <TaskList groupId={group.id} />
      </div>
    </>
  );
}

function DummyTask({ groupId }: { groupId: string | null }) {
  const dummyTask = useTaskStore((s) => {
    return groupId === s.dummyTask?.groupId ? s.dummyTask : null;
  });

  if (!dummyTask) return null;

  return <TaskRow taskId={dummyTask.id} />;
}

function TaskList({ groupId }: { groupId: string | null }) {
  const key = groupId ?? UNGROUPED_KEY;
  const tasks = useTaskStore((s) => s.tasksByGroup[key]);

  return (
    <>{tasks?.map((task) => <TaskRow taskId={task.id} key={task.id} />)}</>
  );
}
