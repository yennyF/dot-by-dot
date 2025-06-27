"use client";

import { Dialog } from "radix-ui";
import { use, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { Task } from "../repositories/types";

interface TaskDeleteDialogProps {
  children: React.ReactNode;
  task: Task;
  onOpenChange?: (open: boolean) => void;
}

export default function TaskDeleteDialog({
  children,
  task,
  onOpenChange,
}: TaskDeleteDialogProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("TaskName must be used within a AppProvider");
  }
  const { deleteTask } = appContext;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    onOpenChange?.(open);
  }, [onOpenChange, open]);

  const handleDeleteConfirm = async () => {
    await deleteTask(task.id);
  };

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
              <Dialog.Description className="dialog-description">
                Are you sure you want to delete &quot;{task.name}&quot;?
                <br />
                <br />
                <span className="text-red-600">
                  This action cannot be undone and all associated data will be
                  permanently removed.
                </span>
              </Dialog.Description>
              <div className="dialog-bottom">
                <Dialog.Close>
                  <div className="button-cancel" onClick={handleDeleteConfirm}>
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
