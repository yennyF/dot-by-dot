"use client";

import { Fragment, use, useMemo, useRef, DragEvent, useEffect } from "react";
import { AppContext } from "../../AppContext";
import TaskTrack from "./TaskTrack";
import GroupName from "./GroupName";
import { Group as GroupType } from "@/app/repositories/types";
import GroupTrack from "./GroupTrack";
import { DropIndicator, useDrop } from "./useDrop";
import TaskName, { DummyTaskName } from "./TaskName";

export default function Group({ group }: { group: GroupType }) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { tasks, totalDays, dummyTask, moveTask, updateTask } = appContext;

  // const dropIndicatorRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const ref = useRef<HTMLDivElement>(null);
  const { handleDrop, handleDragOver, handleDragLeave } = useDrop(
    ref,
    (e: DragEvent, el: HTMLElement) => {
      const taskId = e.dataTransfer.getData("taskId");
      if (!taskId) return;

      const beforeId = el.dataset.beforeId;
      if (beforeId === "-2") {
        updateTask(taskId, undefined);
      } else {
        updateTask(taskId, group.id);
        if (beforeId === "-1") {
          moveTask(taskId, null);
        } else if (beforeId !== taskId) {
          moveTask(taskId, beforeId ?? null);
        }
      }
    }
  );

  const filteredTasks = useMemo(
    () => (tasks ? tasks.filter((task) => task.groupId === group.id) : []),
    [tasks, group.id]
  );

  return (
    <div
      ref={ref}
      className="w-fit"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <DropIndicator
        beforeId={"-2"}
        level={0}
        // ref={(el) => {
        //   dropIndicatorRefs.current[task.id] = el;
        // }}
      />
      <div className="flex h-[40px] w-fit">
        <div className="sticky left-0 z-[9] flex w-[200px] items-center">
          <GroupName group={group} />
        </div>
        <div className="sticky left-[200px] flex">
          {totalDays.map((date) => (
            <GroupTrack
              key={date.toLocaleDateString()}
              date={date}
              tasks={filteredTasks}
            />
          ))}
        </div>
      </div>
      <div className="w-fit">
        {dummyTask && dummyTask.groupId === group.id && (
          <>
            <DropIndicator beforeId={dummyTask.id} level={1} />
            <div className="flex h-[40px] w-fit items-center">
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
        {filteredTasks.map((task) => (
          <Fragment key={task.id}>
            <DropIndicator
              beforeId={task.id}
              level={1}
              // ref={(el) => {
              //   dropIndicatorRefs.current[task.id] = el;
              // }}
            />
            <div className="flex h-[40px] w-fit items-center">
              <TaskName task={task} level={1} />
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
        <DropIndicator
          level={1}
          // ref={(el) => {
          //   dropIndicatorRefs.current[task.id] = el;
          // }}
        />
      </div>
    </div>
  );
}
