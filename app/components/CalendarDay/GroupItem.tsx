"use client";

import { Fragment, use, useRef, DragEvent, useEffect } from "react";
import { AppContext } from "../../AppContext";
import TaskTrack from "./TaskTrack";
import GroupName from "./GroupName";
import { Group } from "@/app/repositories/types";
import { DropIndicator, useDrop } from "./useDrop";
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
  const moveTaskBefore = useTaskStore((s) => s.moveTaskBefore);
  const moveTaskAfter = useTaskStore((s) => s.moveTaskAfter);
  const moveToGroup = useTaskStore((s) => s.moveToGroup);

  // const dropIndicatorRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const ref = useRef<HTMLDivElement>(null);
  const { handleDrop, handleDragOver, handleDragLeave } = useDrop(
    ref,
    (e: DragEvent, el: HTMLElement) => {
      const taskId = e.dataTransfer.getData("taskId");
      if (!taskId) return;

      const beforeId = el.dataset.beforeId;
      if (beforeId) {
        moveTaskBefore(taskId, beforeId);
      } else {
        const afterId = el.dataset.afterId;
        if (afterId) {
          moveTaskAfter(taskId, afterId);
        } else {
          moveToGroup(taskId, null);
        }
      }
    }
  );

  useEffect(() => {
    console.log("GroupItem rendered", group.name);
  });

  if (!tasks) return;

  return (
    <div
      ref={ref}
      className="app-GroupItem w-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <DropIndicator
        level={0}
        // ref={(el) => {
        //   dropIndicatorRefs.current[task.id] = el;
        // }}
      />
      <div className="flex h-[40px]">
        <div className="sticky left-0 z-[9] flex w-[200px] items-center">
          <GroupName group={group} />
        </div>
        <div className="sticky left-[200px] flex">
          {totalDays.map((date) => (
            <GroupTrack
              key={date.toLocaleDateString()}
              date={date}
              tasks={tasks}
            />
          ))}
        </div>
      </div>

      {dummyTask && (
        <>
          <DropIndicator beforeId={dummyTask.id} level={1} />
          <div className="app-TaskDummyItem flex h-[40px] items-center">
            <DummyTaskName task={dummyTask} level={1} />
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
          <DropIndicator
            beforeId={task.id}
            level={1}
            // ref={(el) => {
            //   dropIndicatorRefs.current[task.id] = el;
            // }}
          />
          <div className="flex h-[40px] items-center">
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
      {tasks.length > 0 && (
        <DropIndicator
          afterId={tasks[tasks.length - 1].id}
          level={1}
          // ref={(el) => {
          //   dropIndicatorRefs.current[task.id] = el;
          // }}
        />
      )}
    </div>
  );
}
