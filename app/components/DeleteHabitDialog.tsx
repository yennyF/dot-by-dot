"use client";

import { Dialog } from "radix-ui";
import { useState } from "react";
import { Habit } from "../db";
interface DeleteHabitDialogProps {
  children: React.ReactNode;
  habit: Habit;
  onConfirm: () => void;
}

export default function DeleteHabitDialog({
  children,
  habit,
  onConfirm,
}: DeleteHabitDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      {open && (
        <Dialog.Portal>
          <Dialog.Overlay className="overlay">
            <Dialog.Content className="dialog-content">
              <Dialog.Title>Delete Confirmation</Dialog.Title>
              <Dialog.Description>
                Are you sure you want to delete &quot;{habit.name}&quot;? All
                related records will be lost.
              </Dialog.Description>
              <div className="flex justify-center gap-3">
                <Dialog.Close>
                  <div className="button-accept" onClick={onConfirm}>
                    Yes, I am sure
                  </div>
                </Dialog.Close>
                <Dialog.Close>
                  <div className="button-cancel">No</div>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}
