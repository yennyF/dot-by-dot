"use client";

import { useGroupStore } from "@/app/stores/groupStore";
import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/taskStore";
import { useUIStore } from "@/app/stores/useUIStore";
import { Group } from "@/app/types";
import clsx from "clsx";
import { useTaskLogStore } from "@/app/stores/taskLogStore";
import GroupItem from "./GroupItem";
import TaskItem from "./TaskItem";
import { memo } from "react";
import useClickLog from "@/app/hooks/useLog";

export default function TaskGrid() {
  const dummyGroup = useGroupStore((s) => s.dummyGroup);
  const groups = useGroupStore((s) => s.groups);

  const handleClick = useClickLog();

  return (
    <div className="app-TaskGrid flex flex-col gap-5" onClick={handleClick}>
      <div className="app-group" data-task={"id"}>
        <DummyGroup group={null} />
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

function CollapsibleGroup({ group }: { group: Group | null }) {
  const isOpen = useUIStore((s) => (group ? s.isGroupOpen(group.id) : true));

  return (
    <>
      {group &&
        (isOpen ? <div className="h-row" /> : <GroupRow group={group} />)}
      <DummyGroup group={group} />
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

function DummyGroup({ group }: { group: Group | null }) {
  const dummyTask = useTaskStore((s) => {
    if (!s.dummyTask) return null;
    if (group) {
      return s.dummyTask.groupId === group.id ? s.dummyTask : null;
    } else {
      return s.dummyTask.groupId === null ? s.dummyTask : null;
    }
  });

  return <>{dummyTask && <TaskRow taskId={dummyTask.id} />}</>;
}

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

function TaskRowWrapper({ taskId }: { taskId: string }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);

  return (
    <div className="app-TaskList flex">
      {totalDate.map(([, months]) =>
        months.map(([date, days]) => (
          <div key={date.toDateString()} className="flex min-w-[150px]">
            {days.map((date) => (
              <TaskItem key={date.toDateString()} date={date} taskId={taskId} />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
const TaskRow = memo(TaskRowWrapper);
