"use client";

import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { DragEvent, useState } from "react";
import TaskDeleteDialog from "../TaskDeleteDialog";
import TaskRenamePopover from "../TaskRenamePopover";
import { Task } from "@/app/repositories/types";

interface TaskNameProps {
  task: Task;
}

export default function TaskName({ task }: TaskNameProps) {
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
      className="task-name draggable group sticky left-0 z-[9] ml-[-1px] flex h-full w-[200px] cursor-grab items-center justify-between gap-1 border-l-2 bg-[var(--background)] hover:font-bold active:cursor-grabbing [&.highlight]:font-bold"
      draggable="true"
      data-id={task.id}
      onDragStart={(e) => handleDragStart(e)}
      onDragEnd={(e) => handleDragEnd(e)}
    >
      <div className="ml-[-2] overflow-hidden text-ellipsis text-nowrap border-l-2 pl-3 text-[var(--gray-9)] group-hover:border-[var(--accent)] group-[.highlight]:border-[var(--accent)]">
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
