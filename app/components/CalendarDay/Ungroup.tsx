"use client";

import { Fragment, use, useRef, DragEvent, useEffect } from "react";
import { AppContext } from "../../AppContext";
import TaskName, { DummyTaskName } from "./TaskName";
import UngroupTrack from "./UngroupTrack";
import { DropIndicator, useDrop } from "./useDrop";
import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/TaskStore";
import TaskTrack from "./TaskTrack";

export default function Ungroup() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("Ungroup must be used within a AppProvider");
  }
  const { totalDays } = appContext;

  const dummyTask = useTaskStore((s) =>
    s.dummyTask && s.dummyTask.groupId === undefined ? s.dummyTask : null
  );
  const tasks = useTaskStore((s) => s.tasksByGroup[UNGROUPED_KEY]);
  const moveTaskBefore = useTaskStore((s) => s.moveTaskBefore);
  const moveTaskAfter = useTaskStore((s) => s.moveTaskAfter);

  const ref = useRef<HTMLDivElement>(null);
  const { handleDrop, handleDragOver, handleDragLeave } = useDrop(
    ref,
    (e: DragEvent, el: HTMLElement) => {
      const taskId = e.dataTransfer.getData("taskId");
      if (!taskId) return;

      const beforeId = el.dataset.beforeId;
      if (beforeId) {
        moveTaskBefore(taskId, beforeId);
      } else {
        const afterId = el.dataset.afterId;
        if (afterId) {
          moveTaskAfter(taskId, afterId);
        }
      }
    }
  );

  useEffect(() => {
    console.log("Ungroup rendered");
  });

  return (
    <div
      ref={ref}
      className="app-Ungroup flex w-full flex-col"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {dummyTask && (
        <>
          <DropIndicator beforeId={dummyTask.id} level={0} />
          <div className="app-TaskDummyItem flex h-[40px] items-center">
            <DummyTaskName task={dummyTask} level={0} />
            <div className="sticky left-[200px] flex">
              {totalDays.map((date) => (
                <TaskTrack
                  key={date.toLocaleDateString()}
                  date={date}
                  task={dummyTask}
                />
              ))}
            </div>
          </div>
        </>
      )}
      {tasks?.map((task) => (
        <Fragment key={task.id}>
          <DropIndicator beforeId={task.id} level={0} />
          <div className="flex h-[40px] items-center">
            <TaskName task={task} level={0} />
            <div className="sticky left-[200px] flex">
              {totalDays.map((date) => (
                <UngroupTrack
                  key={date.toLocaleDateString()}
                  date={date}
                  task={task}
                />
              ))}
            </div>
          </div>
        </Fragment>
      ))}
      {tasks?.length > 0 && (
        <DropIndicator afterId={tasks[tasks.length - 1].id} level={0} />
      )}
    </div>
  );
}
