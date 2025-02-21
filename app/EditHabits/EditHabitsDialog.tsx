"use client";

import { Dialog } from "radix-ui";
import { ChangeEvent, use, useState } from "react";
import styles from "./EditHabitsDialog.module.scss";
import { TrashIcon, PlusIcon, Cross1Icon } from "@radix-ui/react-icons";
import { AppContext } from "../AppContext";
import DeleteConfirm from "./DeleteConfirm";

interface EditHabitsDialogProps {
  children: React.ReactNode;
}

export default function EditHabitsDialog({ children }: EditHabitsDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      {open && (
        <Dialog.Portal>
          <Dialog.Overlay className={`${styles.overlay} overlay`}>
            <DialogContent />
          </Dialog.Overlay>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}

function DialogContent() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("DialogContent must be used within a AppProvider");
  }
  const { habits, addHabit, deleteHabit } = appContext;

  const [habitInput, setHabitInput] = useState("");
  const [isDuplicated, setIsDuplicated] = useState(false);

  const handleHabitInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHabitInput(event.target.value);
    setIsDuplicated(false);
  };

  const handleAddHabitClick = () => {
    if (addHabit(habitInput)) {
      setHabitInput("");
    } else {
      setIsDuplicated(true);
    }
  };

  const handleDeleteHabitClick = (habit: string) => {
    deleteHabit(habit);
  };

  return (
    <Dialog.Content
      className={`${styles.content} relative flex max-h-full w-[480px] flex-col gap-10 overflow-y-scroll bg-[var(--background)] p-[30px]`}
    >
      <Dialog.Close>
        <div className="button-icon">
          <Cross1Icon />
        </div>
      </Dialog.Close>
      <Dialog.Title>Edit habits</Dialog.Title>
      <div className="flex flex-col items-start gap-3">
        {habits.map((habit, index) => (
          <div
            key={index}
            className={`${styles.habitItem} flex w-full items-center justify-between gap-0 py-1`}
          >
            {habit}
            <div
              className={`${styles.habitOptions} flex items-center justify-between gap-1`}
            >
              {/* <div className="button-icon">
								<Pencil1Icon className="icon"/>
							</div> */}
              <DeleteConfirm
                habit={habit}
                onConfirm={() => {
                  handleDeleteHabitClick(habit);
                }}
              >
                <div className="button-icon">
                  <TrashIcon className="icon" />
                </div>
              </DeleteConfirm>
            </div>
          </div>
        ))}
      </div>
      <div className="shadow-dark fixed bottom-0 right-0 flex w-[480px] flex-col gap-3 p-[30px]">
        <fieldset className="flex gap-3">
          <input
            type="text"
            value={habitInput}
            onChange={handleHabitInputChange}
            placeholder="New habit"
            className="basis-full"
          ></input>
          <button
            onClick={handleAddHabitClick}
            className="button-main flex-none"
            disabled={habitInput.length === 0}
          >
            <PlusIcon />
            Add
          </button>
        </fieldset>
        <div className="text-sm">
          {isDuplicated ? "This habit already exists" : "\u00A0"}
        </div>
      </div>
    </Dialog.Content>
  );
}
