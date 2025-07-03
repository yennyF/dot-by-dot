"use client";

import { Fragment, use, useMemo, useRef, DragEvent, useEffect } from "react";
import { AppContext } from "../../AppContext";
import TaskName, { DummyTaskName } from "./TaskName";
import UngroupTrack from "./UngroupTrack";
import { DropIndicator, useDrop } from "./useDrop";
import { useTaskStore } from "@/app/stores/TaskStore";

export default function Ungroup() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("Ungroup must be used within a AppProvider");
  }
  const { totalDays } = appContext;

  const tasks = useTaskStore((s) => s.tasks);
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
      <DummyTaskRow />
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

function DummyTaskRow() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("Ungroup must be used within a AppProvider");
  }
  const { totalDays } = appContext;

  const dummyTask = useTaskStore((s) => s.dummyTask);

  useEffect(() => {
    console.log("UngroupDummy rendered");
  });

  if (!dummyTask || dummyTask.groupId) return null;

  return (
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
  );
}
