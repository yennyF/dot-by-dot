"use client";

import { Popover } from "radix-ui";
import { ChangeEvent, KeyboardEvent, use, useEffect, useState } from "react";
import { AppContext } from "../AppContext";

interface RenameHabitPopoverProps {
  children: React.ReactNode;
  habit: string;
}

export default function RenameHabitPopover({
  children,
  habit,
}: RenameHabitPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger data-state={open ? "open" : "close"} asChild>
        {children}
      </Popover.Trigger>
      {open && (
        <Popover.Portal>
          <Content setOpen={setOpen} habit={habit} />
        </Popover.Portal>
      )}
    </Popover.Root>
  );
}

interface ContentProps {
  setOpen: (open: boolean) => void;
  habit: string;
}

function Content({ setOpen, habit }: ContentProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("Content must be used within a AppProvider");
  }
  const { habits, renameHabit } = appContext;

  const [habitInput, setHabitInput] = useState(habit);
  const [isDuplicated, setIsDuplicated] = useState(false);

  useEffect(() => {
    if (habits.includes(habitInput) && habitInput !== habit) {
      setIsDuplicated(true);
    } else {
      setIsDuplicated(false);
    }
  }, [habit, habitInput, habits]);

  const handleHabitInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHabitInput(event.target.value);
  };

  const handleSaveClick = () => {
    if (renameHabit(habit, habitInput)) {
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
      <p>Rename the habit</p>
      <fieldset className="flex flex-col gap-2">
        <input
          type="text"
          value={habitInput}
          onChange={handleHabitInputChange}
          placeholder={habit}
          className="basis-full"
        ></input>
        <div className="text-xs text-red-500">
          {isDuplicated ? "This habit already exists" : "\u00A0"}
        </div>
      </fieldset>
      <div className="flex justify-center gap-3">
        <Popover.Close>
          <div className="button-cancel">Cancel</div>
        </Popover.Close>
        <button
          className="button-accept"
          onClick={handleSaveClick}
          disabled={
            habitInput.length === 0 || isDuplicated || habitInput === habit
          }
        >
          Rename
        </button>
      </div>
      <Popover.Arrow className="arrow" />
    </Popover.Content>
  );
}
