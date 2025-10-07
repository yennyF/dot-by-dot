"use client";

import { Fragment, useEffect, useRef } from "react";
import SortableContainer from "../SortableContainer/SortableContainer";
import { useGroupStore } from "@/app/stores/groupStore";
import DropIndicatorGroup from "../SortableContainer/DropIndicatorGroup";
import GroupRow from "./GroupRow";
import { useTaskStore, UNGROUPED_KEY } from "@/app/stores/taskStore";
import DropIndicatorTask from "../SortableContainer/DropIndicatorTask";
import TaskRow from "./TaskRow";
import { useScrollStore } from "@/app/stores/scrollStore";

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

  return (
    <SortableContainer className="sticky right-0">
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
            <GroupRow group={dummyGroup} isDummy={true} />
          </div>
        )}

        {groups?.map((group) => (
          <div className="app-group" key={group.id}>
            <DropIndicatorGroup beforeId={group.id} />
            <GroupRow group={group} />
            <DummyTask groupId={group.id} />
            <TaskList groupId={group.id} />
          </div>
        ))}

        <DropIndicatorGroup />
      </div>
    </SortableContainer>
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
      <TaskRow task={dummyTask} isDummy={true} />
    </>
  );
}

function TaskList({ groupId }: { groupId: string | null }) {
  const key = groupId ?? UNGROUPED_KEY;
  const tasks = useTaskStore((s) => s.tasksByGroup?.[key]);

  return (
    <>
      {tasks?.map((task) => (
        <Fragment key={task.id}>
          <DropIndicatorTask groupId={groupId ?? null} beforeId={task.id} />
          <TaskRow key={task.id} task={task} />
        </Fragment>
      ))}
      <DropIndicatorTask groupId={groupId} />
    </>
  );
}
