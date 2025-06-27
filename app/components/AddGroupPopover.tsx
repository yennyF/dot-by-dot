"use client";

import { Popover } from "radix-ui";
import { ChangeEvent, KeyboardEvent, use, useEffect, useState } from "react";
import { AppContext } from "../AppContext";

interface AddGroupPopoverProps {
  children: React.ReactNode;
}

export default function AddGroupPopover({ children }: AddGroupPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger data-state={open ? "open" : "close"} asChild>
        {children}
      </Popover.Trigger>
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
  const { groups, addGroup } = appContext;

  const [nameInput, setNameInput] = useState("");
  const [isDuplicated, setIsDuplicated] = useState(false);

  useEffect(() => {
    if (groups === undefined) return;

    if (groups.some((h) => h.name === nameInput)) {
      setIsDuplicated(true);
    } else {
      setIsDuplicated(false);
    }
  }, [nameInput, groups]);

  const handleGroupInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNameInput(event.target.value);
  };

  const handleSaveClick = async () => {
    if (await addGroup(nameInput)) {
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
      align="end"
      alignOffset={0}
      onKeyDown={handleKeyDown}
    >
      <p className="">Enter a new group</p>
      <fieldset className="flex flex-col gap-2">
        <input
          type="text"
          value={nameInput}
          onChange={handleGroupInputChange}
          placeholder="New group"
          className="basis-full"
        ></input>
        <div className="text-xs text-[var(--accent)]">
          {isDuplicated ? "This group already exists" : "\u00A0"}
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
