"use client";

import { Fragment, useEffect, useRef } from "react";
import SortableContainer from "../SortableContainer/SortableContainer";
import { useGroupStore } from "@/app/stores/GroupStore";
import DropIndicatorGroup from "../SortableContainer/DropIndicatorGroup";
import GroupRow from "./GroupRow";
import useOnScreen from "@/app/hooks/useOnScreen";
import { useTaskStore, UNGROUPED_KEY } from "@/app/stores/TaskStore";
import DropIndicatorTask from "../SortableContainer/DropIndicatorTask";
import TaskRow from "./TaskRow";

export default function HeaderSide() {
  const dummyGroup = useGroupStore((s) => s.dummyGroup);
  const groups = useGroupStore((s) => s.groups);

  const topRef = useRef<HTMLDivElement>(null);
  const isTopRefVisible = useOnScreen(topRef);

  useEffect(() => {
    if (dummyGroup && !isTopRefVisible) {
      topRef.current?.scrollIntoView({ block: "center" });
    }
  }, [dummyGroup, isTopRefVisible]);

  return (
    <SortableContainer className="sticky right-0 flex w-name shrink-0 flex-col gap-5 bg-[var(--background)]">
      <div>
        <DummyTaskRow groupId={null} />
        <TaskList groupId={null} />
        <div ref={topRef} />
      </div>

      {dummyGroup && (
        <>
          <DropIndicatorGroup />
          <GroupRow group={dummyGroup} isDummy={true} />
        </>
      )}

      {groups?.map((group) => (
        <Fragment key={group.id}>
          <DropIndicatorGroup beforeId={group.id} />
          <div>
            <GroupRow group={group} />
            <DummyTaskRow groupId={group.id} />
            <TaskList groupId={group.id} />
          </div>
        </Fragment>
      ))}

      <DropIndicatorGroup />
    </SortableContainer>
  );
}

function DummyTaskRow({ groupId }: { groupId: string | null }) {
  const topRef = useRef<HTMLDivElement>(null);
  const isTopRefVisible = useOnScreen(topRef);

  const dummyTask = useTaskStore((s) =>
    s.dummyTask && s.dummyTask.groupId === (groupId || undefined)
      ? s.dummyTask
      : null
  );

  useEffect(() => {
    if (dummyTask && !isTopRefVisible) {
      topRef.current?.scrollIntoView({ block: "center" });
    }
  }, [dummyTask, isTopRefVisible]);

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

function TaskList({ groupId }: { groupId: string | null }) {
  const key = groupId ?? UNGROUPED_KEY;
  const tasks = useTaskStore((s) => s.tasksByGroup?.[key]);

  return (
    <>
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
