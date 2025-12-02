"use client";

import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { DragEvent, memo, useState } from "react";
import clsx from "clsx";
import TaskCreatePopover from "./task/TaskCreatePopover";
import TaskDeleteDialog from "./task/TaskDeleteDialog";
import TaskRenamePopover from "./task/TaskRenamePopover";
import { Tooltip } from "radix-ui";
import stylesTooltip from "@/app/styles/tooltip.module.scss";
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
      <div className="app-TaskItem group/name sticky left-0 flex h-[var(--height-row-view)] items-center justify-between gap-1 bg-[var(--background)]">
        <span className="ml-[22px] overflow-hidden text-ellipsis text-nowrap">
          {task.name}
        </span>

        <div
          className={clsx(
            "gap-1",
            forceShow ? "flex" : "hidden group-hover/name:flex"
          )}
        >
          <TaskRenamePopover task={task} onOpenChange={setForceShow}>
            <span>
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button className="button-icon-sheer">
                      <Pencil1Icon />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className={stylesTooltip.content}
                      align="center"
                      side="bottom"
                      sideOffset={5}
                    >
                      Rename
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </span>
          </TaskRenamePopover>

          <TaskDeleteDialog task={task} onOpenChange={setForceShow}>
            <span>
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button className="button-icon-sheer">
                      <TrashIcon />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className={stylesTooltip.content}
                      align="center"
                      side="bottom"
                      sideOffset={5}
                    >
                      Delete
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </span>
          </TaskDeleteDialog>
        </div>
      </div>
    </div>
  );
}

export function TaskItemDummy({ task }: { task: Task }) {
  return (
    <div className="app-TaskItem group/name sticky left-0 flex h-[var(--height-row-view)] items-center justify-between gap-1 bg-[var(--background)]">
      <span className="ml-[12px] overflow-hidden text-ellipsis text-nowrap">
        {task.name}
      </span>

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
