"use client";

import { Popover } from "radix-ui";
import { ChangeEvent, KeyboardEvent, use, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { Task } from "../repositories";

interface RenameTaskPopoverProps {
  children: React.ReactNode;
  task: Task;
  onOpenChange?: (open: boolean) => void;
}

export default function RenameTaskPopover({
  children,
  task,
  onOpenChange,
}: RenameTaskPopoverProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onOpenChange?.(open);
  }, [onOpenChange, open]);

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
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("Content must be used within a AppProvider");
  }
  const { tasks, renameTask } = appContext;

  const [nameInput, setNameInput] = useState(task.name);
  const [isDuplicated, setIsDuplicated] = useState(false);

  useEffect(() => {
    if (!tasks) return;
    if (tasks.some((h) => h.id !== task.id && h.name === nameInput)) {
      setIsDuplicated(true);
    } else {
      setIsDuplicated(false);
    }
  }, [task, nameInput, tasks]);

  const handleTaskInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNameInput(event.target.value);
  };

  const handleSaveClick = async () => {
    if (await renameTask(task.id, nameInput)) {
      setOpen(false);
    }
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
      sideOffset={10}
      align="center"
      alignOffset={0}
      onKeyDown={handleKeyDown}
    >
      <p>Rename the task</p>
      <fieldset className="flex flex-col gap-2">
        <input
          type="text"
          value={nameInput}
          onChange={handleTaskInputChange}
          placeholder={task.name}
          className="basis-full"
        ></input>
        <div className="text-xs text-orange-500">
          {isDuplicated ? "This task is duplicated" : "\u00A0"}
        </div>
      </fieldset>
      <div className="flex justify-center gap-3">
        <Popover.Close>
          <div className="button-cancel">Cancel</div>
        </Popover.Close>
        <button
          className="button-accept"
          onClick={handleSaveClick}
          disabled={nameInput.length === 0 || nameInput === task.name}
        >
          Rename
        </button>
      </div>
      <Popover.Arrow className="arrow" />
    </Popover.Content>
  );
}
