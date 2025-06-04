"use client";

import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import { Habit } from "../repositories";

interface DeleteHabitDialogProps {
  children: React.ReactNode;
  habit: Habit;
  onConfirm: () => void;
  onOpenChange?: (open: boolean) => void;
}

export default function DeleteHabitDialog({
  children,
  habit,
  onConfirm,
  onOpenChange,
}: DeleteHabitDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onOpenChange?.(open);
  }, [onOpenChange, open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      {open && (
        <Dialog.Portal>
          <Dialog.Overlay className="overlay">
            <Dialog.Content className="dialog-content">
              <Dialog.Title className="dialog-title">
                Delete Confirmation
              </Dialog.Title>
              <Dialog.Description className="dialog-description text-center">
                Are you sure you want to delete &quot;{habit.name}&quot;?
                <div className="mt-5 text-red-600">
                  This action cannot be undone and all associated data will be
                  permanently removed.
                </div>
              </Dialog.Description>
              <div className="dialog-bottom flex justify-center gap-3">
                <Dialog.Close>
                  <div className="button-cancel" onClick={onConfirm}>
                    Yes, delete
                  </div>
                </Dialog.Close>
                <Dialog.Close>
                  <div className="button-accept">Keep</div>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}
