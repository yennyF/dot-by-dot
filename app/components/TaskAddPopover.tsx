"use client";

import { Popover } from "radix-ui";
import { ChangeEvent, KeyboardEvent, use, useEffect, useState } from "react";
import { AppContext } from "../AppContext";

interface TaskAddPopoverProps {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export default function TaskAddPopover({
  children,
  onOpenChange,
}: TaskAddPopoverProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("Content must be used within a AppProvider");
  }
  const { setDummyTask } = appContext;

  const [open, setOpen] = useState(true);

  return (
    <Popover.Root
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setDummyTask(undefined);
        }
        setOpen(open);
        onOpenChange?.(open);
      }}
    >
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      {open && (
        <Popover.Portal>
          <Content />
        </Popover.Portal>
      )}
    </Popover.Root>
  );
}

function Content() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("Content must be used within a AppProvider");
  }
  const { tasks, addTask, dummyTask, setDummyTask } = appContext;

  const [name, setName] = useState("");
  const [isDuplicated, setIsDuplicated] = useState(false);

  useEffect(() => {
    if (tasks?.some((h) => h.name === name)) {
      setIsDuplicated(true);
    } else {
      setIsDuplicated(false);
    }
  }, [name, tasks]);

  const handleTaskInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSaveClick = () => {
    if (!dummyTask) return;
    dummyTask.name = name;
    addTask(dummyTask);
    setName("");
    setDummyTask(undefined);
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
          value={name}
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
          <div className="button-cancel">Discard</div>
        </Popover.Close>
        <Popover.Close
          className="button-accept flex-none"
          onClick={handleSaveClick}
          disabled={name.length === 0}
        >
          Add
        </Popover.Close>
      </div>
      <Popover.Arrow className="arrow" />
    </Popover.Content>
  );
}
