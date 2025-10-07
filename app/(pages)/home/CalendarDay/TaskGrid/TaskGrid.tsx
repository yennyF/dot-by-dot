"use client";

import { useGroupStore } from "@/app/stores/groupStore";
import GroupRow from "./GroupRow";
import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/taskStore";
import TaskRow from "./TaskRow";

export default function Body() {
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
        <div className="app-group" key={group.id} data-name={group.name}>
          <GroupRow group={group} />
          <DummyTask groupId={group.id} />
          <TaskList groupId={group.id} />
        </div>
      ))}
    </div>
  );
}

function DummyTask({ groupId }: { groupId: string | null }) {
  const dummyTask = useTaskStore((s) => {
    if (groupId === s.dummyTask?.groupId) {
      return s.dummyTask;
    }
    return null;
  });

  if (!dummyTask) return null;

  return <TaskRow task={dummyTask} />;
}

function TaskList({ groupId }: { groupId: string | null }) {
  const key = groupId ?? UNGROUPED_KEY;
  const tasks = useTaskStore((s) => s.tasksByGroup?.[key]);

  return <>{tasks?.map((task) => <TaskRow key={task.id} task={task} />)}</>;
}
