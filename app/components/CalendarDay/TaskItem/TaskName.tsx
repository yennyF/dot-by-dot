"use client";

import { DotFilledIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { DragEvent, useEffect, useState } from "react";
import TaskDeleteDialog from "./TaskDeleteDialog";
import TaskRenamePopover from "./TaskRenamePopover";
import { Task } from "@/app/repositories/types";
import clsx from "clsx";
import TaskCreatePopover from "./TaskCreatePopover";
import { useTaskStore } from "@/app/stores/TaskStore";

interface TaskNameProps {
  task: Task;
  isDummy?: boolean;
}

export default function TaskName({ task, isDummy }: TaskNameProps) {
  const [forceShow, setForceShow] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    console.log("TaskName rendered", task.name);
  });

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.setData("sort", "task");
    e.dataTransfer.setData("taskId", task.id);
    setDragging(true);
  };

  const handleDragEnd = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const draggable = isDummy ? false : true;

  return (
    <div
      className={clsx(
        "app-TaskName group/name sticky left-[50px] z-[9] flex h-[40px] w-[200px] items-center justify-between gap-1 bg-[var(--background)]",
        draggable && "draggable cursor-grab active:cursor-grabbing"
      )}
      draggable={draggable}
      data-id={task.id}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="h-[12px] w-[12px] shrink-0" />
        <DotFilledIcon className="h-[12px] w-[12px] shrink-0 text-[var(--black)] opacity-0 group-hover/item:opacity-100" />
        <div className="overflow-hidden text-ellipsis text-nowrap text-[var(--gray-9)]">
          {task.name}
        </div>
      </div>
      {!dragging && (
        <div
          className={clsx(
            "action-buttons gap-1",
            forceShow || isDummy ? "flex" : "hidden group-hover/name:flex"
          )}
        >
          {isDummy ? (
            <TaskCreatePopover>
              <button className="button-icon-sheer">
                <Pencil1Icon />
              </button>
            </TaskCreatePopover>
          ) : (
            <>
              <TaskRenamePopover task={task} onOpenChange={setForceShow}>
                <button className="button-icon-sheer">
                  <Pencil1Icon />
                </button>
              </TaskRenamePopover>
              <TaskDeleteDialog task={task} onOpenChange={setForceShow}>
                <button className="button-icon-sheer">
                  <TrashIcon />
                </button>
              </TaskDeleteDialog>
            </>
          )}
        </div>
      )}
    </div>
  );
}
