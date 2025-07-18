"use client";

import { Pencil1Icon } from "@radix-ui/react-icons";
import { Task } from "@/app/repositories/types";
import clsx from "clsx";
import TaskCreatePopover from "../TaskCreatePopover";

interface DummyTaskNameProps {
  task: Task;
}
export default function TaskNameDummy({ task }: DummyTaskNameProps) {
  return (
    <div
      className={clsx(
        "task-name sticky left-0 z-[9] flex h-full w-[200px] cursor-grab items-center justify-between gap-1 bg-[var(--background)] hover:font-bold [&.highlight]:font-bold",
        task.groupId && "border-l-2"
      )}
      data-id={task.id}
    >
      <div
        className={clsx(
          "overflow-hidden text-ellipsis text-nowrap text-[var(--gray-9)]",
          task.groupId ? "pl-5" : "pl-2"
        )}
      >
        {task.name}
      </div>
      <div className="action-buttons">
        <TaskCreatePopover>
          <button className="button-icon-sheer">
            <Pencil1Icon />
          </button>
        </TaskCreatePopover>
      </div>
    </div>
  );
}
