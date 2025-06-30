"use client";

import { Fragment, use, useMemo } from "react";
import { AppContext } from "../../AppContext";
import TaskName from "./TaskName";
import UngroupTrack from "./UngroupTrack";
import { DropIndicator } from "./useDrop";

export default function Ungroup() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { tasks, totalDays } = appContext;

  const filteredTasks = useMemo(
    () => (tasks ? tasks.filter((task) => task.groupId === undefined) : []),
    [tasks]
  );

  return (
    <>
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
    </>
  );
}
