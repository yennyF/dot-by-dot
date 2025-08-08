import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/TaskStore";
import { Fragment } from "react";
import DropIndicatorTask from "./Draggable/DropIndicatorTask";
import TaskItem from "./TaskItem/TaskItem";

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
    <>
      {dummyTask && (
        <>
          <DropIndicatorTask
            groupId={groupId ?? null}
            beforeId={dummyTask.id}
          />
          <TaskItem task={dummyTask} isDummy={true} />
        </>
      )}

      {tasks?.map((task) => (
        <Fragment key={task.id}>
          <DropIndicatorTask
            groupId={task.groupId ?? null}
            beforeId={task.id}
          />
          <TaskItem task={task} />
        </Fragment>
      ))}
      <DropIndicatorTask groupId={groupId ?? null} />
    </>
  );
}
