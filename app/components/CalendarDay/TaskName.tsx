"use client";

import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { DragEvent, useState } from "react";
import TaskDeleteDialog from "../TaskDeleteDialog";
import TaskRenamePopover from "../TaskRenamePopover";
import { Task } from "@/app/repositories/types";
import clsx from "clsx";

interface TaskNameProps {
  task: Task;
  level: 0 | 1;
}

export default function TaskName({ task, level }: TaskNameProps) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e: DragEvent) => {
    // e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskId", task.id.toString());
    setDragging(true);
  };

  const handleDragEnd = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  return (
    <div
      className={clsx(
        "task-name draggable group sticky left-0 z-[9] flex h-full w-[200px] cursor-grab items-center justify-between gap-1 bg-[var(--background)] hover:font-bold active:cursor-grabbing [&.highlight]:font-bold",
        level === 1 && "border-l-2"
      )}
      draggable="true"
      data-id={task.id}
      onDragStart={(e) => handleDragStart(e)}
      onDragEnd={(e) => handleDragEnd(e)}
    >
      <div
        className={clsx(
          "overflow-hidden text-ellipsis text-nowrap text-[var(--gray-9)]",
          level === 0 && "pl-2",
          level === 1 && "pl-5"
        )}
      >
        {task.name}
      </div>
      {!dragging && (
        <div
          className="action-buttons hidden gap-1 group-hover:flex [&[data-state=open]]:flex"
          data-state={open ? "open" : "closed"}
        >
          <TaskRenamePopover task={task} onOpenChange={setOpen}>
            <button className="button-icon">
              <Pencil1Icon />
            </button>
          </TaskRenamePopover>
          <TaskDeleteDialog task={task} onOpenChange={setOpen}>
            <button className="button-icon">
              <TrashIcon />
            </button>
          </TaskDeleteDialog>
        </div>
      )}
    </div>
  );
}
