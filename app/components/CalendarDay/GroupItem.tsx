"use client";

import { Fragment, use, useEffect } from "react";
import { AppContext } from "../../AppContext";
import TaskTrack from "./TaskTrack";
import GroupName from "./GroupName";
import { Group } from "@/app/repositories/types";
import DropIndicatorTask from "./Draggable/DropIndicatorTask";
import TaskName, { DummyTaskName } from "./TaskName";
import { useTaskStore } from "@/app/stores/TaskStore";
import GroupTrack from "./GroupTrack";

export default function GroupItem({ group }: { group: Group }) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { totalDays } = appContext;

  const dummyTask = useTaskStore((s) =>
    s.dummyTask && s.dummyTask.groupId === group.id ? s.dummyTask : null
  );
  const tasks = useTaskStore((s) => s.tasksByGroup?.[group.id]);

  useEffect(() => {
    console.log("GroupItem rendered", group.name);
  });

  return (
    <div className="app-GroupItem w-full">
      <div className="flex h-[40px]">
        <div className="sticky left-0 z-[9] flex w-[200px] items-center">
          <GroupName group={group} />
        </div>
        <div className="sticky left-[200px] flex">
          {totalDays.map((date) => (
            <GroupTrack
              key={date.toLocaleDateString()}
              date={date}
              tasks={tasks || []}
            />
          ))}
        </div>
      </div>

      {dummyTask && (
        <>
          <DropIndicatorTask
            groupId={dummyTask.groupId ?? null}
            beforeId={dummyTask.id}
          />
          <div className="app-TaskDummyItem flex h-[40px] items-center">
            <DummyTaskName task={dummyTask} />
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
          <DropIndicatorTask
            groupId={task.groupId ?? null}
            beforeId={task.id}
          />
          <div className="flex h-[40px] items-center">
            <TaskName task={task} />
            <div className="sticky left-[200px] flex">
              {totalDays.map((date) => (
                <TaskTrack
                  key={date.toLocaleDateString()}
                  date={date}
                  task={task}
                />
              ))}
            </div>
          </div>
        </Fragment>
      ))}
      <DropIndicatorTask groupId={group.id} />
    </div>
  );
}
