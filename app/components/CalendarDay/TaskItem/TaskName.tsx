"use client";

import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { DragEvent, useState } from "react";
import TaskDeleteDialog from "./TaskDeleteDialog";
import TaskRenamePopover from "./TaskRenamePopover";
import { Task } from "@/app/repositories/types";
import clsx from "clsx";
import TaskCreatePopover from "./TaskCreatePopover";

interface TaskNameProps {
  task: Task;
  isDummy?: boolean;
}

export default function TaskName({ task, isDummy }: TaskNameProps) {
  const [forceShow, setForceShow] = useState(false);
  const [dragging, setDragging] = useState(false);

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
        "app-TaskName group sticky left-[50px] z-[9] flex h-[40px] w-[200px] items-center justify-between gap-1 bg-[var(--background)] hover:font-bold [&.highlight]:font-bold",
        draggable && "draggable cursor-grab active:cursor-grabbing",
        task.groupId && "border-l-2"
      )}
      draggable={draggable}
      data-id={task.id}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className={clsx(
          "overflow-hidden text-ellipsis text-nowrap text-[var(--gray-9)]",
          task.groupId ? "pl-5" : "pl-0"
        )}
      >
        {task.name}
      </div>
      {!dragging && (
        <div
          className={clsx(
            "action-buttons gap-1",
            forceShow || isDummy ? "flex" : "hidden group-hover:flex"
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
