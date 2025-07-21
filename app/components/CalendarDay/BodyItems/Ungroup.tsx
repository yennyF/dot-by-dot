"use client";

import { Fragment, use, useEffect } from "react";
import { AppContext } from "../../../AppContext";
import TaskName from "./TaskName";
import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/TaskStore";
import DropIndicatorTask from "../Draggable/DropIndicatorTask";
import TaskTrack from "./TaskTrack";
import { Element } from "@/app/components/Scroll";
import TaskNameDummy from "./TaskNameDummy";

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
      <Element id="create-task">
        {dummyTask && (
          <>
            <DropIndicatorTask groupId={null} beforeId={dummyTask.id} />
            <div className="app-TaskDummyItem flex h-[40px] items-center">
              <TaskNameDummy task={dummyTask} />
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
      </Element>
      {tasks.map((task) => (
        <Fragment key={task.id}>
          <DropIndicatorTask groupId={null} beforeId={task.id} />
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
      <DropIndicatorTask groupId={null} />
    </div>
  );
}
