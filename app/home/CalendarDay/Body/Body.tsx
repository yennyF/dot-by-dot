"use client";

import { useGroupStore } from "@/app/stores/GroupStore";
import GroupRow from "./GroupRow";
import TaskList from "./TaskList";
import { useShallow } from "zustand/react/shallow";

export default function Body() {
  const { dummyGroup, groups } = useGroupStore(
    useShallow((s) => ({
      dummyGroup: s.dummyGroup,
      groups: s.groups,
    }))
  );

  return (
    <div className="flex shrink-0 flex-col gap-4">
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
