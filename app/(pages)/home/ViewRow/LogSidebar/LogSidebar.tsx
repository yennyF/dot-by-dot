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
import { Accordion } from "radix-ui";
import { useUIStore } from "@/app/stores/useUIStore";
import { ChevronDownIcon } from "@radix-ui/react-icons";

export default function LogSidebar() {
  const taskSidebarRef = useScrollStore((s) => s.taskSidebarRef);
  const topGroupRef = useRef<HTMLDivElement>(null);

  const dummyGroup = useGroupStore((s) => s.dummyGroup);
  const groups = useGroupStore((s) => s.groups);

  const openGroups = useUIStore((s) => s.openGroups);
  const setOpenGroups = useUIStore((s) => s.setOpenGroups);
  const openGroup = useUIStore((s) => s.openGroup);

  useEffect(() => {
    if (dummyGroup) {
      openGroup(dummyGroup.id);
      topGroupRef.current?.scrollIntoView({ block: "center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dummyGroup]);

  return (
    <SortableContainer className="sticky right-0 z-10">
      <div
        ref={taskSidebarRef}
        className="flex w-[var(--width-name-row-view)] shrink-0 flex-col gap-5 bg-[var(--background)]"
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
            <Accordion.Root
              value={openGroups}
              onValueChange={setOpenGroups}
              type="multiple"
            >
              <Accordion.Item value={group.id}>
                <Accordion.Header>
                  <Accordion.Trigger asChild>
                    <div className="group flex w-full items-center justify-between gap-[10px] bg-[var(--background)]">
                      <GroupItem group={group} />{" "}
                      <ChevronDownIcon className="button-icon-accordion transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180" />
                    </div>
                  </Accordion.Trigger>
                </Accordion.Header>

                <DummyTask groupId={group.id} />

                <Accordion.Content className="ml-[22px]">
                  <TaskList groupId={group.id} />
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
            <DropIndicatorTask groupId={group.id} />
          </div>
        ))}

        <DropIndicatorGroup />
      </div>
    </SortableContainer>
  );
}

function TaskList({ groupId }: { groupId: string | null }) {
  const tasks = useTaskStore((s) => s.tasksByGroup[groupId ?? UNGROUPED_KEY]);

  return (
    <>
      {tasks && tasks.length ? (
        tasks.map((task) => (
          <Fragment key={task.id}>
            <DropIndicatorTask groupId={groupId ?? null} beforeId={task.id} />
            <TaskItem task={task} />
          </Fragment>
        ))
      ) : (
        <div className="h-[var(--height-row-view)] text-[var(--gray-9)]">
          (No tasks)
        </div>
      )}
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
