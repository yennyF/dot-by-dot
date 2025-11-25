"use client";

import React from "react";
import { useGroupStore } from "@/app/stores/groupStore";
import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/taskStore";
import { CubeIcon } from "@radix-ui/react-icons";
import Breadcrumbs, { BreadcrumbsItem } from "@/app/components/Breadcrumbs";
import TaskGrid from "./TaskGrid";
import GroupGrid from "./GroupGrid";
import { useUIStore } from "@/app/stores/useUIStore";

export default function LogGrid({}) {
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

      {selectedGroup ? (
        <GroupDetail groupId={selectedGroup.id} />
      ) : (
        <GroupAll />
      )}
    </div>
  );
}

function GroupAll() {
  const groups = useGroupStore((s) => s.groups);
  const setSelectedGroup = useUIStore((s) => s.setSelectedGroup);

  return (
    <div>
      <GroupDetail groupId={null} />
      <div className="mt-[80px] flex flex-wrap justify-start gap-[80px]">
        {groups.map((group) => (
          <div key={group.id} className="flex flex-col gap-[15px]">
            <GroupLabel
              onClick={() => {
                setSelectedGroup(group);
              }}
            >
              {group.name}
            </GroupLabel>
            <GroupGrid groupId={group.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

function GroupDetail({ groupId }: { groupId: string | null }) {
  const tasks = useTaskStore((s) => s.tasksByGroup[groupId ?? UNGROUPED_KEY]);

  return (
    <div className="flex flex-wrap justify-start gap-[80px]">
      {tasks?.map((task) => (
        <div key={task.id} className="flex flex-col items-center gap-[15px]">
          <TaskLabel>{task.name}</TaskLabel>
          <TaskGrid taskId={task.id} />
        </div>
      ))}
    </div>
  );
}

function GroupLabel({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      className="flex items-center justify-center gap-[10px]"
      onClick={onClick}
    >
      <CubeIcon className="text-[var(--gray-9)]" />
      <TaskLabel>{children}</TaskLabel>
    </button>
  );
}

function TaskLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="overflow-hidden text-ellipsis text-nowrap">
      {children}
    </span>
  );
}
