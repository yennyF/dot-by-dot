"use client";

import { Fragment, use, useMemo, useRef, DragEvent } from "react";
import { AppContext } from "../../AppContext";
import TaskName, { DummyTaskName } from "./TaskName";
import UngroupTrack from "./UngroupTrack";
import { DropIndicator, useDrop } from "./useDrop";

export default function Ungroup() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("Ungroup must be used within a AppProvider");
  }
  const { tasks, totalDays, updateTask, moveTask, dummyTask } = appContext;

  const ref = useRef<HTMLDivElement>(null);
  const { handleDrop, handleDragOver, handleDragLeave } = useDrop(
    ref,
    (e: DragEvent, el: HTMLElement) => {
      const beforeId = el.dataset.beforeId;
      const taskId = e.dataTransfer.getData("taskId");

      updateTask(taskId, undefined);

      if (beforeId === "-1") {
        moveTask(taskId, null);
      } else if (beforeId !== taskId) {
        moveTask(taskId, beforeId ?? null);
      }
    }
  );

  const filteredTasks = useMemo(
    () => (tasks ? tasks.filter((task) => task.groupId === undefined) : []),
    [tasks]
  );

  if (filteredTasks.length === 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="flex flex-col"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {dummyTask && !dummyTask.groupId && (
        <>
          <DropIndicator beforeId={dummyTask.id} level={0} />
          <div className="flex h-[40px] w-fit items-center">
            <DummyTaskName task={dummyTask} level={0} />
            <div className="sticky left-[200px] flex">
              {totalDays.map((date) => (
                <UngroupTrack
                  key={date.toLocaleDateString()}
                  date={date}
                  task={dummyTask}
                />
              ))}
            </div>
          </div>
        </>
      )}
      {filteredTasks.map((task) => (
        <Fragment key={task.id}>
          <DropIndicator beforeId={task.id} level={0} />
          <div className="flex h-[40px] w-fit items-center">
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
