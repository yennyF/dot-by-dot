"use client";

import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { DragEvent, useState } from "react";
import TaskDeleteDialog from "../TaskDeleteDialog";
import TaskRenamePopover from "../TaskRenamePopover";
import { Task } from "@/app/repositories/types";
import clsx from "clsx";
import TaskAddPopover from "../TaskAddPopover";

interface TaskNameProps {
  task: Task;
  level: 0 | 1;
}

export default function TaskName({ task, level }: TaskNameProps) {
  const [forceShow, setForceShow] = useState(false);
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
        "app-TaskName draggable group sticky left-0 z-[9] flex h-full w-[200px] cursor-grab items-center justify-between gap-1 bg-[var(--background)] hover:font-bold active:cursor-grabbing [&.highlight]:font-bold",
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
          className={clsx(
            "action-buttons gap-1",
            forceShow ? "flex" : "hidden group-hover:flex"
          )}
        >
          <TaskRenamePopover task={task} onOpenChange={setForceShow}>
            <button className="button-icon">
              <Pencil1Icon />
            </button>
          </TaskRenamePopover>
          <TaskDeleteDialog task={task} onOpenChange={setForceShow}>
            <button className="button-icon">
              <TrashIcon />
            </button>
          </TaskDeleteDialog>
        </div>
      )}
    </div>
  );
}

export function DummyTaskName({ task, level }: TaskNameProps) {
  return (
    <div
      className={clsx(
        "task-name sticky left-0 z-[9] flex h-full w-[200px] cursor-grab items-center justify-between gap-1 bg-[var(--background)] hover:font-bold [&.highlight]:font-bold",
        level === 1 && "border-l-2"
      )}
      data-id={task.id}
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
      <div className="action-buttons">
        <TaskAddPopover>
          <button className="button-icon">
            <Pencil1Icon />
          </button>
        </TaskAddPopover>
      </div>
    </div>
  );
}
