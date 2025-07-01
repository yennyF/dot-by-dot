"use client";

import { Fragment, use, useMemo, useRef, useState, DragEvent } from "react";
import { AppContext } from "../../AppContext";
import TaskTrack from "./TaskTrack";
import { ChevronDownIcon, MinusIcon } from "@radix-ui/react-icons";
import { Collapsible } from "radix-ui";
import GroupName from "./GroupName";
import { Group as GroupType } from "@/app/repositories/types";
import GroupTrack from "./GroupTrack";
import { DropIndicator, useDrop } from "./useDrop";
import TaskName from "./TaskName";

export default function Group({ group }: { group: GroupType }) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { tasks, totalDays, moveTask, updateTask } = appContext;

  // const dropIndicatorRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const ref = useRef<HTMLDivElement>(null);
  const { handleDrop, handleDragOver, handleDragLeave } = useDrop(
    ref,
    (e: DragEvent, el: HTMLElement) => {
      const beforeId = Number(el.dataset.beforeId);
      const taskId = Number(e.dataTransfer.getData("taskId"));

      updateTask(taskId, group.id);

      if (beforeId === -1) {
        moveTask(taskId, null);
      } else if (beforeId !== taskId) {
        moveTask(taskId, beforeId);
      }
    }
  );

  const [open, setOpen] = useState(true);

  const filteredTasks = useMemo(
    () => (tasks ? tasks.filter((task) => task.groupId === group.id) : []),
    [tasks, group.id]
  );

  return (
    <Collapsible.Root className="" open={open} onOpenChange={setOpen}>
      <div className="flex h-[40px] w-fit">
        <div className="sticky left-0 z-[9] flex w-[200px] items-center">
          <Collapsible.Trigger className="flex h-fit items-center bg-[var(--background)]">
            {open ? <MinusIcon /> : <ChevronDownIcon />}
          </Collapsible.Trigger>
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

      <Collapsible.Content
        ref={ref}
        className="w-fit"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {filteredTasks.map((task) => (
          <Fragment key={task.id}>
            <DropIndicator
              beforeId={task.id}
              // ref={(el) => {
              //   dropIndicatorRefs.current[task.id] = el;
              // }}
            />
            <div className="flex h-[40px] w-fit items-center">
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
        <DropIndicator
          beforeId={-1}
          // ref={(el) => {
          //   dropIndicatorRefs.current[task.id] = el;
          // }}
        />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
