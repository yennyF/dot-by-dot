"use client";

import { DragEvent, Fragment, use, useMemo, useRef, useState } from "react";
import { AppContext } from "../../AppContext";
import TaskTrack from "./TaskTrack";
import { RowSpacingIcon, Cross1Icon } from "@radix-ui/react-icons";
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

  const ref = useRef<HTMLDivElement>(null);
  const {
    getIndicators,
    clearHighlights,
    highlightIndicator,
    getNearestIndicator,
  } = useDrop(ref);

  const handleDrop = (e: DragEvent) => {
    clearHighlights();

    const indicators = getIndicators();
    const el = getNearestIndicator(e, indicators);
    if (!el) return;

    const beforeId = Number(el.element.dataset.beforeId);
    const taskId = Number(e.dataTransfer.getData("taskId"));

    updateTask(taskId, group.id);

    if (beforeId === -1) {
      moveTask(taskId, null);
    } else if (beforeId !== taskId) {
      moveTask(taskId, beforeId);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
  };

  const handleDragLeave = () => {
    clearHighlights();
  };

  const [open, setOpen] = useState(true);

  const filteredTasks = useMemo(
    () => (tasks ? tasks.filter((task) => task.groupId === group.id) : []),
    [tasks, group.id]
  );

  // const dropIndicatorRefs = useRef<Record<number, HTMLDivElement | null>>({});

  return (
    <Collapsible.Root className="" open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger>
        <div className="sticky left-0 flex w-[200px] items-center gap-2">
          {open ? <Cross1Icon /> : <RowSpacingIcon />}
          <span className="text-xs">Total task: {filteredTasks.length}</span>
        </div>
        <div className="sticky left-0 flex h-[40px] w-fit">
          <GroupName group={group} />
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
      </Collapsible.Trigger>
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
