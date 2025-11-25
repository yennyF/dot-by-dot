"use client";

import { Fragment, useEffect, useRef } from "react";
import SortableContainer from "../SortableContainer/SortableContainer";
import { useGroupStore } from "@/app/stores/groupStore";
import DropIndicatorGroup from "../SortableContainer/DropIndicatorGroup";
import GroupItem, { GroupItemDummy } from "./GroupItem";
import { useTaskStore, UNGROUPED_KEY } from "@/app/stores/taskStore";
import DropIndicatorTask from "../SortableContainer/DropIndicatorTask";
import TaskItem, { TaskItemDummy } from "./TaskItem";
import { useScrollStore } from "@/app/stores/scrollStore";
import { Group } from "@/app/types";
import { Collapsible } from "radix-ui";
import { useUIStore } from "@/app/stores/useUIStore";

export default function LogSidebar() {
  const taskSidebarRef = useScrollStore((s) => s.taskSidebarRef);
  const topGroupRef = useRef<HTMLDivElement>(null);

  const dummyGroup = useGroupStore((s) => s.dummyGroup);
  const groups = useGroupStore((s) => s.groups);

  useEffect(() => {
    if (dummyGroup) {
      topGroupRef.current?.scrollIntoView({ block: "center" });
    }
  }, [dummyGroup]);

  return (
    <SortableContainer className="sticky right-0 z-10">
      <div
        ref={taskSidebarRef}
        className="flex w-name shrink-0 flex-col gap-5 bg-[var(--background)]"
      >
        <div className="app-group">
          <DummyTask groupId={null} />
          <TaskList groupId={null} />
          <DropIndicatorTask groupId={null} />
        </div>

        {dummyGroup && (
          <div className="app-group" ref={topGroupRef}>
            <DropIndicatorGroup />
            <GroupItemDummy group={dummyGroup} />
          </div>
        )}

        {groups.map((group) => (
          <div key={group.id} className="app-group">
            <DropIndicatorGroup beforeId={group.id} />
            <CollapsibleGroup group={group} />
            <DropIndicatorTask groupId={group.id} />
          </div>
        ))}

        <DropIndicatorGroup />
      </div>
    </SortableContainer>
  );
}

function CollapsibleGroup({ group }: { group: Group }) {
  const isOpen = useUIStore((s) => s.isGroupOpen(group.id));
  const toggleGroup = useUIStore((s) => s.toggleGroup);

  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={() => {
        toggleGroup(group.id);
      }}
    >
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
  );
}

function TaskList({ groupId }: { groupId: string | null }) {
  const tasks = useTaskStore((s) => s.tasksByGroup[groupId ?? UNGROUPED_KEY]);

  return (
    <>
      {tasks?.map((task) => (
        <Fragment key={task.id}>
          <DropIndicatorTask groupId={groupId ?? null} beforeId={task.id} />
          <TaskItem task={task} />
        </Fragment>
      ))}
    </>
  );
}

function DummyTask({ groupId }: { groupId: string | null }) {
  const topTaskRef = useRef<HTMLDivElement>(null);

  const dummyTask = useTaskStore((s) => {
    if (groupId === s.dummyTask?.groupId) return s.dummyTask;
    return null;
  });

  useEffect(() => {
    if (dummyTask) {
      topTaskRef.current?.scrollIntoView({ block: "center" });
    }
  }, [dummyTask]);

  if (!dummyTask) return null;

  return <TaskItemDummy task={dummyTask} />;
}
