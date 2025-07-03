"use client";

import { AppContext } from "@/app/AppContext";
import { Group } from "@/app/repositories/types";
import { useTaskStore } from "@/app/stores/TaskStore";
import { use, useEffect } from "react";
import { DummyTaskName } from "./TaskName";
import TaskTrack from "./TaskTrack";
import { DropIndicator } from "./useDrop";

export default function TaskDummyItem({ group }: { group?: Group }) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { totalDays } = appContext;

  const dummyTask = useTaskStore((s) => s.dummyTask);

  useEffect(() => {
    console.log("TaskDummyItem rendered", group?.name);
  });

  if (group) {
    if (!dummyTask || dummyTask.groupId !== group.id) return null;
  } else {
    if (!dummyTask || dummyTask.groupId) return null;
  }

  return (
    <>
      <DropIndicator beforeId={dummyTask.id} level={group ? 1 : 0} />
      <div className="app-TaskDummyItem flex h-[40px] items-center">
        <DummyTaskName task={dummyTask} level={group ? 1 : 0} />
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
  );
}
