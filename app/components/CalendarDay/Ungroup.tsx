"use client";

import { Fragment, use, useRef, DragEvent, useEffect } from "react";
import { AppContext } from "../../AppContext";
import TaskName from "./TaskName";
import UngroupTrack from "./UngroupTrack";
import { DropIndicator, useDrop } from "./useDrop";
import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/TaskStore";
import TaskDummyItem from "./TaskDummyItem";

export default function Ungroup() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("Ungroup must be used within a AppProvider");
  }
  const { totalDays } = appContext;

  const tasks = useTaskStore((s) => s.tasksByGroup[UNGROUPED_KEY]);
  const updateTask = useTaskStore((s) => s.updateTask);
  const moveTask = useTaskStore((s) => s.moveTask);

  const ref = useRef<HTMLDivElement>(null);
  const { handleDrop, handleDragOver, handleDragLeave } = useDrop(
    ref,
    (e: DragEvent, el: HTMLElement) => {
      const beforeId = el.dataset.beforeId;
      const taskId = e.dataTransfer.getData("taskId");

      updateTask(taskId, { groupId: undefined });

      if (beforeId === "-1") {
        moveTask(taskId, null);
      } else if (beforeId !== taskId) {
        moveTask(taskId, beforeId ?? null);
      }
    }
  );

  useEffect(() => {
    console.log("Ungroup rendered");
  });

  if (tasks?.length === 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="app-Ungroup flex w-full flex-col"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <TaskDummyItem />
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
      <DropIndicator level={0} />
    </div>
  );
}
