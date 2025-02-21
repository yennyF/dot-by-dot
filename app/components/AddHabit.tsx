"use client";

import { Dialog } from "radix-ui";
import { ChangeEvent, use, useState } from "react";
import { AppContext } from "../AppContext";

interface AddHabitProps {
  children: React.ReactNode;
}

export default function AddHabit({ children }: AddHabitProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      {open && (
        <Dialog.Portal>
          <Dialog.Overlay className="overlay">
            <Content setOpen={setOpen} />
          </Dialog.Overlay>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}

function Content({ setOpen }: { setOpen: (open: boolean) => void }) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("DialogContent must be used within a AppProvider");
  }
  const { addHabit } = appContext;

  const [habitInput, setHabitInput] = useState("");
  const [isDuplicated, setIsDuplicated] = useState(false);

  const handleHabitInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHabitInput(event.target.value);
    setIsDuplicated(false);
  };

  const handleAddHabitClick = () => {
    if (addHabit(habitInput)) {
      setOpen(false);
    } else {
      setIsDuplicated(true);
    }
  };

  return (
    <Dialog.Content className="dialog-content flex flex-col justify-center gap-8">
      <Dialog.Title className="hidden">Add Habit</Dialog.Title>
      <Dialog.Description className="">Enter a new habit</Dialog.Description>
      <fieldset className="flex flex-col gap-2">
        <input
          type="text"
          value={habitInput}
          onChange={handleHabitInputChange}
          placeholder="New habit"
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
          onClick={handleAddHabitClick}
          disabled={habitInput.length === 0}
        >
          Save
        </button>
      </div>
    </Dialog.Content>
  );
}
