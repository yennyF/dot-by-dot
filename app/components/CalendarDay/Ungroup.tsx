"use client";

import { Fragment, use, useEffect } from "react";
import { AppContext } from "../../AppContext";
import TaskName, { DummyTaskName } from "./TaskName";
import UngroupTrack from "./UngroupTrack";
import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/TaskStore";
import TaskTrack from "./TaskTrack";
import DropIndicator from "./Draggable/DropIndicator";

export default function Ungroup() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("Ungroup must be used within a AppProvider");
  }
  const { totalDays } = appContext;

  const dummyTask = useTaskStore((s) =>
    s.dummyTask && s.dummyTask.groupId === undefined ? s.dummyTask : null
  );
  const tasks = useTaskStore((s) => s.tasksByGroup?.[UNGROUPED_KEY]);

  useEffect(() => {
    console.log("Ungroup rendered");
  });

  if (!tasks) return;

  return (
    <div className="app-Ungroup flex w-full flex-col">
      {dummyTask && (
        <>
          <DropIndicator beforeId={dummyTask.id} level={"ungroup-task"} />
          <div className="app-TaskDummyItem flex h-[40px] items-center">
            <DummyTaskName task={dummyTask} level={"ungroup-task"} />
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
      {tasks.map((task) => (
        <Fragment key={task.id}>
          <DropIndicator beforeId={task.id} level={"ungroup-task"} />
          <div className="flex h-[40px] items-center">
            <TaskName task={task} level={"ungroup-task"} />
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
      {tasks.length > 0 && (
        <DropIndicator
          afterId={tasks[tasks.length - 1].id}
          level={"ungroup-task"}
        />
      )}
    </div>
  );
}
