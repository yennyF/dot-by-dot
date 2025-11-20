"use client";

import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { DragEvent, memo, useState } from "react";
import clsx from "clsx";
import TaskCreatePopover from "./task/TaskCreatePopover";
import TaskDeleteDialog from "./task/TaskDeleteDialog";
import TaskRenamePopover from "./task/TaskRenamePopover";
import {
  AppContentTrigger,
  AppTooltip,
  AppTooltipTrigger,
} from "@/app/components/AppTooltip";
import { Task } from "@/app/types";

interface TaskItemProps {
  task: Task;
}

function TaskItemWrapper({ task }: TaskItemProps) {
  const [forceShow, setForceShow] = useState(false);

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.setData("sort", "task");
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDragEnd = (e: DragEvent) => {
    e.preventDefault();
  };

  if (!task) return null;

  return (
    <div
      className="draggable active:cursor-grabbing"
      draggable={true}
      data-id={task.id}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="app-TaskItem group/name sticky left-0 flex h-row items-center justify-between gap-1 bg-[var(--background)]">
        <div className="ml-[22px] overflow-hidden text-ellipsis text-nowrap">
          {task.name}
        </div>

        <div
          className={clsx(
            "gap-1",
            forceShow ? "flex" : "hidden group-hover/name:flex"
          )}
        >
          <TaskRenamePopover task={task} onOpenChange={setForceShow}>
            <span>
              <AppTooltip>
                <AppTooltipTrigger asChild>
                  <button className="button-icon-sheer">
                    <Pencil1Icon />
                  </button>
                </AppTooltipTrigger>
                <AppContentTrigger>Rename</AppContentTrigger>
              </AppTooltip>
            </span>
          </TaskRenamePopover>

          <TaskDeleteDialog task={task} onOpenChange={setForceShow}>
            <span>
              <AppTooltip>
                <AppTooltipTrigger asChild>
                  <button className="button-icon-sheer">
                    <TrashIcon />
                  </button>
                </AppTooltipTrigger>
                <AppContentTrigger>Delete</AppContentTrigger>
              </AppTooltip>
            </span>
          </TaskDeleteDialog>
        </div>
      </div>
    </div>
  );
}

export function TaskItemDummy({ task }: { task: Task }) {
  return (
    <div className="app-TaskItem group/name sticky left-0 flex h-row items-center justify-between gap-1 bg-[var(--background)]">
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="ml-[12px] overflow-hidden text-ellipsis text-nowrap">
          {task.name}
        </div>
      </div>

      <div>
        <TaskCreatePopover>
          <button className="button-icon-sheer">
            <Pencil1Icon />
          </button>
        </TaskCreatePopover>
      </div>
    </div>
  );
}

const TaskItem = memo(TaskItemWrapper);
export default TaskItem;
