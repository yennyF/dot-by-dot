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

export default function HeaderRow() {
  const headerRowRef = useScrollStore((s) => s.headerRowRef);

  const dummyGroup = useGroupStore((s) => s.dummyGroup);
  const groups = useGroupStore((s) => s.groups);

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dummyGroup) {
      topRef.current?.scrollIntoView({ block: "center" });
    }
  }, [dummyGroup]);

  return (
    <SortableContainer className="sticky right-0">
      <div
        ref={headerRowRef}
        className="flex w-name shrink-0 flex-col gap-10 bg-[var(--background)]"
      >
        <TaskListUngrouped />

        {dummyGroup && (
          <div>
            <DropIndicatorGroup ref={topRef} />
            <GroupRow group={dummyGroup} isDummy={true} />
          </div>
        )}

        {groups?.map((group) => (
          <Fragment key={group.id}>
            <div>
              <DropIndicatorGroup beforeId={group.id} />
              <GroupRow group={group} />
              <TaskListGrouped groupId={group.id} />
            </div>
          </Fragment>
        ))}

        <DropIndicatorGroup />
      </div>
    </SortableContainer>
  );
}

function TaskListUngrouped() {
  const dummyTask = useTaskStore((s) =>
    s.dummyTask && s.dummyTask.groupId === undefined ? s.dummyTask : null
  );
  const tasks = useTaskStore((s) => s.tasksByGroup?.[UNGROUPED_KEY]);

  if (!dummyTask && (!tasks || tasks.length === 0)) return null;

  return (
    <div>
      {dummyTask && <DummyTaskRow groupId={null} />}
      {tasks?.map((task) => <TaskRow key={task.id} task={task} />)}
    </div>
  );
}

function TaskListGrouped({ groupId }: { groupId: string }) {
  const key = groupId ?? UNGROUPED_KEY;
  const tasks = useTaskStore((s) => s.tasksByGroup?.[key]);

  return (
    <>
      <DummyTaskRow groupId={groupId} />
      {tasks?.map((task) => (
        <Fragment key={task.id}>
          <DropIndicatorTask
            groupId={task.groupId ?? null}
            beforeId={task.id}
          />
          <TaskRow task={task} />
        </Fragment>
      ))}
      <DropIndicatorTask groupId={groupId ?? null} />
    </>
  );
}

function DummyTaskRow({ groupId }: { groupId: string | null }) {
  const topRef = useRef<HTMLDivElement>(null);

  const dummyTask = useTaskStore((s) =>
    s.dummyTask && s.dummyTask.groupId === (groupId || undefined)
      ? s.dummyTask
      : null
  );

  useEffect(() => {
    topRef.current?.scrollIntoView({ block: "center" });
  }, [dummyTask]);

  return (
    <>
      <div ref={topRef} />
      {dummyTask && (
        <>
          <DropIndicatorTask
            groupId={groupId ?? null}
            beforeId={dummyTask.id}
          />
          <TaskRow task={dummyTask} isDummy={true} />
        </>
      )}
    </>
  );
}
