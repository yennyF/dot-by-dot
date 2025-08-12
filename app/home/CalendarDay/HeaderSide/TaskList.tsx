"use client";

import { Fragment } from "react";
import { useTaskStore, UNGROUPED_KEY } from "@/app/stores/TaskStore";
import DropIndicatorTask from "../SortableContainer/DropIndicatorTask";
import TaskRow from "./TaskRow";

interface TaskListProps {
  groupId: string | null;
}

export default function TaskList({ groupId }: TaskListProps) {
  const dummyTask = useTaskStore((s) =>
    s.dummyTask && s.dummyTask.groupId === (groupId || undefined)
      ? s.dummyTask
      : null
  );

  const key = groupId ?? UNGROUPED_KEY;
  const tasks = useTaskStore((s) => s.tasksByGroup?.[key]);

  return (
    <div>
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
