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
    throw new Error("PopoverContent must be used within a AppProvider");
  }
  const { habits, addHabit } = appContext;

  const [habitInput, setHabitInput] = useState("");
  const [isDuplicated, setIsDuplicated] = useState(false);

  useEffect(() => {
    if (habits.includes(habitInput)) {
      setIsDuplicated(true);
    } else {
      setIsDuplicated(false);
    }
  }, [habitInput, habits]);

  const handleHabitInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHabitInput(event.target.value);
  };

  const handleSaveClick = () => {
    if (addHabit(habitInput)) {
      setHabitInput("");
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
          value={habitInput}
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
          disabled={habitInput.length === 0 || isDuplicated}
        >
          Add
        </button>
      </div>
      <Popover.Arrow className="arrow" />
    </Popover.Content>
  );
}
