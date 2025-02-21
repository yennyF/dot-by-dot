"use client";

import { Dialog } from "radix-ui";
import { ChangeEvent, use, useEffect, useState } from "react";
import { AppContext } from "../AppContext";

interface RenameHabitProps {
  children: React.ReactNode;
  habit: string;
}

export default function RenameHabit({ children, habit }: RenameHabitProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      {open && (
        <Dialog.Portal>
          <Dialog.Overlay className="overlay">
            <Content setOpen={setOpen} habit={habit} />
          </Dialog.Overlay>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}

interface ContentProps {
  setOpen: (open: boolean) => void;
  habit: string;
}

function Content({ setOpen, habit }: ContentProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("DialogContent must be used within a AppProvider");
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

  return (
    <Dialog.Content className="dialog-content flex flex-col justify-center gap-8">
      <Dialog.Title className="hidden">Rename Habit</Dialog.Title>
      <Dialog.Description className="">Rename the habit</Dialog.Description>
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
        <Dialog.Close>
          <div className="button-main">Cancel</div>
        </Dialog.Close>
        <button
          className="button-main flex-none"
          onClick={handleSaveClick}
          disabled={
            habitInput.length === 0 || isDuplicated || habitInput === habit
          }
        >
          Save
        </button>
      </div>
    </Dialog.Content>
  );
}
