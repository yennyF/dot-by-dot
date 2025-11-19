"use client";

import { Fragment, useEffect, useRef } from "react";
import SortableContainer from "../SortableContainer/SortableContainer";
import { useGroupStore } from "@/app/stores/groupStore";
import DropIndicatorGroup from "../SortableContainer/DropIndicatorGroup";
import GroupItem from "./GroupItem";
import { useTaskStore, UNGROUPED_KEY } from "@/app/stores/taskStore";
import DropIndicatorTask from "../SortableContainer/DropIndicatorTask";
import TaskItem from "./TaskItem";
import { useScrollStore } from "@/app/stores/scrollStore";
import { Group } from "@/app/types";
import { Collapsible } from "radix-ui";
import { useUIStore } from "@/app/stores/useUIStore";

export default function TaskSidebar() {
  const headerRowRef = useScrollStore((s) => s.headerRowRef);
  const topGroupRef = useRef<HTMLDivElement>(null);

  const dummyGroup = useGroupStore((s) => s.dummyGroup);
  const groups = useGroupStore((s) => s.groups);

  useEffect(() => {
    if (dummyGroup) {
      topGroupRef.current?.scrollIntoView({ block: "center" });
    }
  }, [dummyGroup]);

  if (!groups) return null;

  return (
    <SortableContainer className="sticky right-0 z-10">
      <div
        ref={headerRowRef}
        className="flex w-name shrink-0 flex-col gap-5 bg-[var(--background)]"
      >
        <div className="app-group">
          <DummyTask groupId={null} />
          <TaskList groupId={null} />
        </div>

        {dummyGroup && (
          <div className="app-group" ref={topGroupRef}>
            <DropIndicatorGroup />
            <GroupItem group={dummyGroup} isDummy={true} />
          </div>
        )}

        {groups.map((group) => (
          <CollapsibleGroup key={group.id} group={group} />
        ))}

        <DropIndicatorGroup />
      </div>
    </SortableContainer>
  );
}

function CollapsibleGroup({ group }: { group: Group }) {
  const isOpen = useUIStore((s) => s.isGroupOpen(group.id));
  const toggleCollapsedGroup = useUIStore((s) => s.toggleCollapsedGroup);

  const setOpen = () => {
    toggleCollapsedGroup(group.id);
  };

  return (
    <div className="app-group">
      <Collapsible.Root open={isOpen} onOpenChange={setOpen}>
        <DropIndicatorGroup beforeId={group.id} />

        <Collapsible.Trigger asChild>
          <span className="w-full">
            <GroupItem group={group} />
          </span>
        </Collapsible.Trigger>

        <DummyTask groupId={group.id} />

        <Collapsible.Content>
          <TaskList groupId={group.id} />
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}

function TaskList({ groupId }: { groupId: string | null }) {
  const key = groupId ?? UNGROUPED_KEY;
  const taskIds = useTaskStore((s) => s.tasksByGroup?.[key]);

  if (!taskIds) return null;

  return (
    <>
      {taskIds.map((id) => (
        <Fragment key={id}>
          <DropIndicatorTask groupId={groupId ?? null} beforeId={id} />
          <TaskItem key={id} taskId={id} />
        </Fragment>
      ))}
      <DropIndicatorTask groupId={groupId} />
    </>
  );
}

function DummyTask({ groupId }: { groupId: string | null }) {
  const topTaskRef = useRef<HTMLDivElement>(null);

  const dummyTask = useTaskStore((s) => {
    if (groupId === s.dummyTask?.groupId) {
      return s.dummyTask;
    }
    return null;
  });

  useEffect(() => {
    if (dummyTask) {
      topTaskRef.current?.scrollIntoView({ block: "center" });
    }
  }, [dummyTask]);

  if (!dummyTask) return null;

  return (
    <>
      <DropIndicatorTask
        ref={topTaskRef}
        groupId={groupId}
        beforeId={dummyTask.id}
      />
      <TaskItem taskId={dummyTask.id} isDummy={true} />
    </>
  );
}
