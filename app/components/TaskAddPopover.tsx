"use client";

import { Popover } from "radix-ui";
import { ChangeEvent, KeyboardEvent, use, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { Group } from "../repositories/types";

interface TaskAddPopoverProps {
  children: React.ReactNode;
  group: Group;
  onOpenChange?: (open: boolean) => void;
}

export default function TaskAddPopover({
  children,
  group,
  onOpenChange,
}: TaskAddPopoverProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onOpenChange?.(open);
  }, [onOpenChange, open]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger data-state={open ? "open" : "close"} asChild>
        {children}
      </Popover.Trigger>
      {open && (
        <Popover.Portal>
          <Content group={group} />
        </Popover.Portal>
      )}
    </Popover.Root>
  );
}

function Content({ group }: { group: Group }) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("Content must be used within a AppProvider");
  }
  const { tasks, addTask } = appContext;

  const [nameInput, setNameInput] = useState("");
  const [isDuplicated, setIsDuplicated] = useState(false);

  useEffect(() => {
    if (tasks === undefined) return;

    if (tasks.some((h) => h.name === nameInput)) {
      setIsDuplicated(true);
    } else {
      setIsDuplicated(false);
    }
  }, [nameInput, tasks]);

  const handleTaskInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNameInput(event.target.value);
  };

  const handleSaveClick = async () => {
    if (await addTask(nameInput, group.id)) {
      setNameInput("");
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
      <p className="">Enter a new task</p>
      <fieldset className="flex flex-col gap-2">
        <input
          type="text"
          value={nameInput}
          onChange={handleTaskInputChange}
          placeholder="New task"
          className="basis-full"
        ></input>
        <div className="text-xs text-[var(--accent)]">
          {isDuplicated ? "This task already exists" : "\u00A0"}
        </div>
      </fieldset>
      <div className="flex justify-center gap-3">
        <Popover.Close>
          <div className="button-cancel">Cancel</div>
        </Popover.Close>
        <button
          className="button-accept flex-none"
          onClick={handleSaveClick}
          disabled={nameInput.length === 0 || isDuplicated}
        >
          Add
        </button>
      </div>
      <Popover.Arrow className="arrow" />
    </Popover.Content>
  );
}
