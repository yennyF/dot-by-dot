"use client";

import { Fragment, useEffect } from "react";
import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/TaskStore";
import DropIndicatorTask from "./Draggable/DropIndicatorTask";
import TaskItem from "./TaskItem/TaskItem";
import { LinkReceptor } from "../Scroll";

export default function UngroupedTasks() {
  const dummyTask = useTaskStore((s) =>
    s.dummyTask && s.dummyTask.groupId === undefined ? s.dummyTask : null
  );
  const tasks = useTaskStore((s) => s.tasksByGroup?.[UNGROUPED_KEY]);

  useEffect(() => {
    console.log("UngroupedTasks rendered");
  });

  return (
    <div className="app-UngroupedTasks flex w-fit flex-col">
      <LinkReceptor id="create-task" />
      {dummyTask && (
        <>
          <DropIndicatorTask groupId={null} beforeId={dummyTask.id} />
          <TaskItem task={dummyTask} isDummy={true} />
        </>
      )}

      {tasks?.map((task) => (
        <Fragment key={task.id}>
          <DropIndicatorTask groupId={null} beforeId={task.id} />
          <TaskItem task={task} />
        </Fragment>
      ))}
      <DropIndicatorTask groupId={null} />
    </div>
  );
}
