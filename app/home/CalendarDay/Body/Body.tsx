"use client";

import { useGroupStore } from "@/app/stores/GroupStore";
import GroupRow from "./GroupRow";
import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/TaskStore";
import TaskRow from "./TaskRow";

export default function Body() {
  const dummyGroup = useGroupStore((s) => s.dummyGroup);
  const groups = useGroupStore((s) => s.groups);

  return (
    <div className="app-Body flex flex-col gap-10">
      <TaskListUngrouped />

      {dummyGroup && <GroupRow group={dummyGroup} />}

      {groups?.map((group) => (
        <div key={group.id} data-name={group.name}>
          <GroupRow group={group} />
          <TaskListGrouped groupId={group.id} />
        </div>
      ))}
    </div>
  );
}

function TaskListUngrouped() {
  const dummyTask = useTaskStore((s) =>
    s.dummyTask && s.dummyTask.groupId === undefined ? s.dummyTask : null
  );
  const tasks = useTaskStore((s) => s.tasksByGroup?.[UNGROUPED_KEY]);

  if (!dummyTask && (!tasks || tasks.length === 0)) return null;

  return (
    <div>
      {dummyTask && <TaskRow task={dummyTask} />}
      {tasks?.map((task) => <TaskRow key={task.id} task={task} />)}
    </div>
  );
}

function TaskListGrouped({ groupId }: { groupId: string | null }) {
  const key = groupId ?? UNGROUPED_KEY;
  const tasks = useTaskStore((s) => s.tasksByGroup?.[key]);

  const dummyTask = useTaskStore((s) =>
    s.dummyTask && s.dummyTask.groupId === groupId ? s.dummyTask : null
  );

  return (
    <>
      {dummyTask && <TaskRow task={dummyTask} />}
      {tasks?.map((task) => <TaskRow key={task.id} task={task} />)}
    </>
  );
}
