"use client";

import React from "react";
import { useGroupStore } from "@/app/stores/groupStore";
import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/taskStore";
import TaskGrid from "./TaskGrid";
import GroupGrid from "./GroupGrid";
import { useUIStore } from "@/app/stores/useUIStore";
import { HomeIcon } from "@radix-ui/react-icons";

export default function ViewGrid() {
  const selectedGroup = useUIStore((s) => s.selectedGroup);
  const setSelectedGroup = useUIStore((s) => s.setSelectedGroup);
  const groups = useGroupStore((s) => s.groups);

  return (
    <div className="my-[100px] flex-1 px-[50px]">
      <div className="sticky top-[100px] z-10 mb-[60px]">
        <div className="flex flex-wrap gap-[10px]">
          <button
            data-state={selectedGroup === null ? "active" : undefined}
            className="button-outline button-sm"
            onClick={() => setSelectedGroup(null)}
          >
            <HomeIcon />
          </button>
          {groups.map((group) => (
            <button
              key={group.id}
              data-state={selectedGroup === group.id ? "active" : undefined}
              className="button-outline button-sm"
              onClick={() => setSelectedGroup(group.id)}
            >
              {group.name}
            </button>
          ))}
        </div>
      </div>

      <div
        className="grid justify-center gap-[60px]"
        style={{
          gridTemplateColumns: "repeat(auto-fill, var(--width-grid-view))",
        }}
      >
        {selectedGroup ? (
          <TaskList groupId={selectedGroup} />
        ) : (
          <>
            <TaskList groupId={null} />
            <GroupList />
          </>
        )}
      </div>
    </div>
  );
}

function GroupList() {
  const groups = useGroupStore((s) => s.groups);
  return groups.map((group) => <GroupGrid key={group.id} group={group} />);
}

function TaskList({ groupId }: { groupId: string | null }) {
  const tasks = useTaskStore((s) => s.tasksByGroup[groupId ?? UNGROUPED_KEY]);
  return tasks?.map((task) => <TaskGrid key={task.id} task={task} />);
}
