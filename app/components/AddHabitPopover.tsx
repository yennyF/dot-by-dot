"use client";

import { Popover } from "radix-ui";
import { ChangeEvent, KeyboardEvent, use, useEffect, useState } from "react";
import { AppContext } from "../AppContext";

interface AddHabitPopoverProps {
  children: React.ReactNode;
}

export default function AddHabitPopover({ children }: AddHabitPopoverProps) {
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
  const { habits, addHabit } = appContext;

  const [nameInput, setNameInput] = useState("");
  const [isDuplicated, setIsDuplicated] = useState(false);

  useEffect(() => {
    if (habits === undefined) return;

    if (habits.some((h) => h.name === nameInput)) {
      setIsDuplicated(true);
    } else {
      setIsDuplicated(false);
    }
  }, [nameInput, habits]);

  const handleHabitInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNameInput(event.target.value);
  };

  const handleSaveClick = async () => {
    if (await addHabit(nameInput)) {
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
      <p className="">Enter a new habit</p>
      <fieldset className="flex flex-col gap-2">
        <input
          type="text"
          value={nameInput}
          onChange={handleHabitInputChange}
          placeholder="New habit"
          className="basis-full"
        ></input>
        <div className="text-xs text-[var(--accent)]">
          {isDuplicated ? "This habit already exists" : "\u00A0"}
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
