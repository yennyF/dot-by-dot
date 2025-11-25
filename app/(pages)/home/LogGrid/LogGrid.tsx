"use client";

import React from "react";
import { useGroupStore } from "@/app/stores/groupStore";
import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/taskStore";
import { CubeIcon } from "@radix-ui/react-icons";
import Breadcrumbs, { BreadcrumbsItem } from "@/app/components/Breadcrumbs";
import TaskGrid from "./TaskGrid";
import GroupGrid from "./GroupGrid";
import { useUIStore } from "@/app/stores/useUIStore";

export default function LogGrid() {
  const selectedGroup = useUIStore((s) => s.selectedGroup);
  const setSelectedGroup = useUIStore((s) => s.setSelectedGroup);

  return (
    <div className="my-[100px] flex-1 px-[50px]">
      <div className="my-[20px]">
        <Breadcrumbs value={selectedGroup?.id ?? "-1"}>
          <BreadcrumbsItem
            value={"-1"}
            onClick={() => setSelectedGroup(undefined)}
          >
            All groups
          </BreadcrumbsItem>
          {selectedGroup && (
            <BreadcrumbsItem
              value={selectedGroup.id}
              className="flex items-center gap-[10px]"
            >
              <CubeIcon className="size-[20px]" />
              <span>{selectedGroup.name}</span>
            </BreadcrumbsItem>
          )}
        </Breadcrumbs>
      </div>

      <>
        <TaskList groupId={selectedGroup?.id || null} />
        {!selectedGroup && <GroupList />}
      </>
    </div>
  );
}

function GroupList() {
  const groups = useGroupStore((s) => s.groups);

  if (groups.length === 0) return;

  return (
    <div
      className="mt-[80px] grid justify-center gap-[60px]"
      style={{ gridTemplateColumns: "repeat(auto-fill, 250px)" }}
    >
      {groups.map((group) => (
        <GroupGrid key={group.id} group={group} />
      ))}
    </div>
  );
}

function TaskList({ groupId }: { groupId: string | null }) {
  const tasks = useTaskStore((s) => s.tasksByGroup[groupId ?? UNGROUPED_KEY]);

  if (!tasks || tasks.length === 0) return;

  return (
    <div
      className="mt-[80px] grid justify-center gap-[60px]"
      style={{ gridTemplateColumns: "repeat(auto-fill, 250px)" }}
    >
      {tasks.map((task) => (
        <TaskGrid key={task.id} task={task} />
      ))}
    </div>
  );
}
