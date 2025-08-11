"use client";

import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { DragEvent, useEffect, useState } from "react";
import { Task } from "@/app/repositories/types";
import clsx from "clsx";
import TaskCreatePopover from "./task/TaskCreatePopover";
import TaskDeleteDialog from "./task/TaskDeleteDialog";
import TaskRenamePopover from "./task/TaskRenamePopover";
import AppTooltip from "@/app/components/AppTooltip";

interface TaskRowProps {
  task: Task;
  isDummy?: boolean;
}

export default function TaskRow({ task, isDummy }: TaskRowProps) {
  const [forceShow, setForceShow] = useState(false);

  useEffect(() => {
    console.log("TaskRow rendered", task.name);
  });

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.setData("sort", "task");
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDragEnd = (e: DragEvent) => {
    e.preventDefault();
  };

  const draggable = isDummy ? false : true;

  return (
    <div
      className={clsx(
        "app-TaskRow group/name h-row sticky left-0 flex items-center justify-between gap-1 bg-[var(--background)]",
        draggable && "draggable cursor-grab active:cursor-grabbing"
      )}
      style={{ width: "var(--width-name)" }}
      draggable={draggable}
      data-id={task.id}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="h-[12px] w-[12px] shrink-0" />
        <div className="overflow-hidden text-ellipsis text-nowrap text-[var(--gray-9)]">
          {task.name}
        </div>
      </div>

      <div
        className={clsx(
          "action-buttons gap-1",
          forceShow || isDummy ? "flex" : "hidden group-hover/name:flex"
        )}
      >
        {isDummy ? (
          <TaskCreatePopover>
            <span>
              <AppTooltip content="Rename" contentClassName="z-10" asChild>
                <button className="button-icon-sheer">
                  <Pencil1Icon />
                </button>
              </AppTooltip>
            </span>
          </TaskCreatePopover>
        ) : (
          <>
            <TaskRenamePopover task={task} onOpenChange={setForceShow}>
              <span>
                <AppTooltip content="Rename" contentClassName="z-10" asChild>
                  <button className="button-icon-sheer">
                    <Pencil1Icon />
                  </button>
                </AppTooltip>
              </span>
            </TaskRenamePopover>

            <TaskDeleteDialog task={task} onOpenChange={setForceShow}>
              <span>
                <AppTooltip content="Delete" contentClassName="z-10" asChild>
                  <button className="button-icon-sheer">
                    <TrashIcon />
                  </button>
                </AppTooltip>
              </span>
            </TaskDeleteDialog>
          </>
        )}
      </div>
    </div>
  );
}
