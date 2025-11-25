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

      {/* <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[40px]"> */}

      <TaskList groupId={selectedGroup?.id || null} />
      {!selectedGroup && <GroupList />}
    </div>
  );
}

function GroupList() {
  const groups = useGroupStore((s) => s.groups);

  return (
    <div className="mt-[80px] flex flex-wrap gap-[100px]">
      {groups.map((group) => (
        <GroupGrid key={group.id} group={group} />
      ))}
    </div>
  );
}

function TaskList({ groupId }: { groupId: string | null }) {
  const tasks = useTaskStore((s) => s.tasksByGroup[groupId ?? UNGROUPED_KEY]);

  return (
    <div className="flex flex-wrap gap-[100px]">
      {tasks?.map((task) => <TaskGrid key={task.id} task={task} />)}
    </div>
  );
}
