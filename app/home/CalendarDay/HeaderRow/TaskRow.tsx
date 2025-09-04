"use client";

import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { DragEvent, memo, useState } from "react";
import { Task } from "@/app/types";
import clsx from "clsx";
import TaskCreatePopover from "./task/TaskCreatePopover";
import TaskDeleteDialog from "./task/TaskDeleteDialog";
import TaskRenamePopover from "./task/TaskRenamePopover";
import {
  AppContent,
  AppTooltip,
  AppTrigger,
} from "@/app/components/AppTooltip";

interface TaskRowProps {
  task: Task;
  isDummy?: boolean;
}

function TaskRowWrapper({ task, isDummy }: TaskRowProps) {
  const draggable = isDummy ? false : true;
  const [forceShow, setForceShow] = useState(false);

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.setData("sort", "task");
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDragEnd = (e: DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={clsx(
        "app-TaskRow group/name sticky left-0 flex h-row items-center justify-between gap-1 bg-[var(--background)]",
        draggable && "draggable cursor-grab active:cursor-grabbing"
      )}
      draggable={draggable}
      data-id={task.id}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="h-[12px] w-[12px] shrink-0" />
        <div className="overflow-hidden text-ellipsis text-nowrap">
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
            <button className="button-icon-sheer">
              <Pencil1Icon />
            </button>
          </TaskCreatePopover>
        ) : (
          <>
            <TaskRenamePopover task={task} onOpenChange={setForceShow}>
              <span>
                <AppTooltip>
                  <AppTrigger asChild>
                    <button className="button-icon-sheer">
                      <Pencil1Icon />
                    </button>
                  </AppTrigger>
                  <AppContent>Rename</AppContent>
                </AppTooltip>
              </span>
            </TaskRenamePopover>

            <TaskDeleteDialog task={task} onOpenChange={setForceShow}>
              <span>
                <AppTooltip>
                  <AppTrigger asChild>
                    <button className="button-icon-sheer">
                      <TrashIcon />
                    </button>
                  </AppTrigger>
                  <AppContent>Delete</AppContent>
                </AppTooltip>
              </span>
            </TaskDeleteDialog>
          </>
        )}
      </div>
    </div>
  );
}

const TaskRow = memo(TaskRowWrapper);
export default TaskRow;
