"use client";

import { useGroupStore } from "@/app/stores/GroupStore";
import GroupRow from "./GroupRow";
import TaskList from "./TaskList";

export default function Body() {
  const dummyGroup = useGroupStore((s) => s.dummyGroup);
  const groups = useGroupStore((s) => s.groups);

  return (
    <div className="flex shrink-0 flex-col gap-10">
      <TaskList groupId={null} />
      {dummyGroup && <GroupRow group={dummyGroup} />}
      {groups?.map((group) => (
        <div key={group.id}>
          <GroupRow group={group} />
          <TaskList groupId={group.id} />
        </div>
      ))}
    </div>
  );
}
