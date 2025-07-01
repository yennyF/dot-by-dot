"use client";

import { Fragment, use, useMemo, useRef, DragEvent } from "react";
import { AppContext } from "../../AppContext";
import TaskName from "./TaskName";
import UngroupTrack from "./UngroupTrack";
import { DropIndicator, useDrop } from "./useDrop";

export default function Ungroup() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { tasks, totalDays, updateTask, moveTask } = appContext;

  const ref = useRef<HTMLDivElement>(null);
  const { handleDrop, handleDragOver, handleDragLeave } = useDrop(
    ref,
    (e: DragEvent, el: HTMLElement) => {
      const beforeId = Number(el.dataset.beforeId);
      const taskId = Number(e.dataTransfer.getData("taskId"));

      updateTask(taskId, undefined);

      if (beforeId === -1) {
        moveTask(taskId, null);
      } else if (beforeId !== taskId) {
        moveTask(taskId, beforeId);
      }
    }
  );

  const filteredTasks = useMemo(
    () => (tasks ? tasks.filter((task) => task.groupId === undefined) : []),
    [tasks]
  );

  return (
    <div
      ref={ref}
      className="mt-5 flex flex-col"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {filteredTasks.map((task) => (
        <Fragment key={task.id}>
          <DropIndicator beforeId={task.id} />
          <div className="flex h-[40px] w-fit items-center">
            <TaskName task={task} />
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
      <DropIndicator beforeId={-1} />
    </div>
  );
}
