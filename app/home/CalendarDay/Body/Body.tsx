"use client";

import { useGroupStore } from "@/app/stores/GroupStore";
import GroupRow from "./GroupRow";
import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/TaskStore";
import TaskRow from "./TaskRow";

export default function Body() {
  const dummyGroup = useGroupStore((s) => s.dummyGroup);
  const groups = useGroupStore((s) => s.groups);

  return (
    <div className="flex shrink-0 flex-col gap-10">
      <div>
        <DummyTaskRow groupId={null} />
        <TaskList groupId={null} />
      </div>

      {dummyGroup && <GroupRow group={dummyGroup} />}

      {groups?.map((group) => (
        <div key={group.id}>
          <GroupRow group={group} />
          <DummyTaskRow groupId={group.id} />
          <TaskList groupId={group.id} />
        </div>
      ))}
    </div>
  );
}

function DummyTaskRow({ groupId }: { groupId: string | null }) {
  const dummyTask = useTaskStore((s) =>
    s.dummyTask && s.dummyTask.groupId === (groupId || undefined)
      ? s.dummyTask
      : null
  );
  return dummyTask ? <TaskRow task={dummyTask} /> : null;
}

function TaskList({ groupId }: { groupId: string | null }) {
  const key = groupId ?? UNGROUPED_KEY;
  const tasks = useTaskStore((s) => s.tasksByGroup?.[key]);
  return tasks?.map((task) => <TaskRow key={task.id} task={task} />);
}
