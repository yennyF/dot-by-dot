"use client";

import { Task } from "@/app/repositories/types";
import { useTaskStore, UNGROUPED_KEY } from "@/app/stores/taskStore";
import { Popover } from "radix-ui";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

interface TaskRenamePopoverProps {
  children: React.ReactNode;
  task: Task;
  onOpenChange: (open: boolean) => void;
}

export default function TaskRenamePopover({
  children,
  task,
  onOpenChange,
}: TaskRenamePopoverProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onOpenChange(open);
  }, [open, onOpenChange]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      {open && (
        <Popover.Portal>
          <Content setOpen={setOpen} task={task} />
        </Popover.Portal>
      )}
    </Popover.Root>
  );
}

interface ContentProps {
  setOpen: (open: boolean) => void;
  task: Task;
}

function Content({ setOpen, task }: ContentProps) {
  const tasks = useTaskStore(
    (s) => s.tasksByGroup?.[task.groupId ?? UNGROUPED_KEY]
  );
  const updateTask = useTaskStore((s) => s.updateTask);

  const [name, setName] = useState(task.name);
  const [isDuplicated, setIsDuplicated] = useState(false);

  useEffect(() => {
    if (!tasks) return;
    if (
      tasks.some(
        (t) => t.id !== task.id && t.groupId === task.groupId && t.name === name
      )
    ) {
      setIsDuplicated(true);
    } else {
      setIsDuplicated(false);
    }
  }, [task, name, tasks]);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSaveClick = async () => {
    updateTask(task.id, { name });
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveClick();
    }
  };

  return (
    <Popover.Content
      className="popover-content z-20 flex w-[350px] flex-col gap-3"
      side="bottom"
      align="center"
      onKeyDown={handleKeyDown}
    >
      <p>Rename the task</p>
      <fieldset className="flex flex-col gap-2">
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder={task.name}
        ></input>
        <div className="warning-xs">
          {isDuplicated
            ? task.groupId !== undefined
              ? "There is a task with the same name in this group"
              : "There is a task with the same name"
            : ""}
        </div>
      </fieldset>
      <div className="flex justify-center gap-3">
        <Popover.Close>
          <div className="button-cancel">Cancel</div>
        </Popover.Close>
        <button
          className="button-accept"
          onClick={handleSaveClick}
          disabled={name.length === 0 || name === task.name}
        >
          Save
        </button>
      </div>
      <Popover.Arrow className="arrow" />
    </Popover.Content>
  );
}
