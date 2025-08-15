"use client";

import { Fragment, useEffect, useRef } from "react";
import { useTaskStore, UNGROUPED_KEY } from "@/app/stores/TaskStore";
import DropIndicatorTask from "../SortableContainer/DropIndicatorTask";
import TaskRow from "./TaskRow";
import useOnScreen from "@/app/hooks/useOnScreen";

interface TaskListProps {
  groupId: string | null;
}

export default function TaskList({ groupId }: TaskListProps) {
  const key = groupId ?? UNGROUPED_KEY;

  const dummyTask = useTaskStore((s) =>
    s.dummyTask && s.dummyTask.groupId === (groupId || undefined)
      ? s.dummyTask
      : null
  );
  const tasks = useTaskStore((s) => s.tasksByGroup?.[key]);

  const topRef = useRef<HTMLDivElement>(null);
  const isTopRefVisible = useOnScreen(topRef);

  useEffect(() => {
    if (dummyTask && !isTopRefVisible) {
      topRef.current?.scrollIntoView({ block: "center" });
    }
  }, [dummyTask, isTopRefVisible]);

  return (
    <div>
      <div ref={topRef}></div>

      {dummyTask && (
        <>
          <DropIndicatorTask
            groupId={groupId ?? null}
            beforeId={dummyTask.id}
          />
          <TaskRow task={dummyTask} isDummy={true} />
        </>
      )}

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
    </div>
  );
}
