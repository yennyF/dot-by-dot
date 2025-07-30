"use client";

import { Dialog, Checkbox } from "radix-ui";
import { useEffect, useState } from "react";
import { Task } from "../../../repositories/types";
import { useTaskStore } from "../../../stores/TaskStore";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";

interface TaskDeleteDialogProps {
  children: React.ReactNode;
  task: Task;
  onOpenChange: (open: boolean) => void;
}

export default function TaskDeleteDialog({
  children,
  task,
  onOpenChange,
}: TaskDeleteDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onOpenChange(open);
  }, [open, onOpenChange]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      {open && (
        <Dialog.Portal>
          <Dialog.Overlay className="overlay">
            <Content task={task} />
          </Dialog.Overlay>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}

function Content({ task }: { task: Task }) {
  const deleteTask = useTaskStore((s) => s.deleteTask);

  const [checked, setChecked] = useState<boolean | "indeterminate">(false);

  const handleDeleteConfirm = async () => {
    deleteTask(task.id);
  };

  return (
    <Dialog.Content className="dialog-content">
      <div className="flex justify-between">
        <Dialog.Title className="dialog-title">
          Are you absolutely sure?
        </Dialog.Title>
        <Dialog.Close asChild>
          <button className="button-icon-sheer shrink-0">
            <Cross1Icon />
          </button>
        </Dialog.Close>
      </div>
      <Dialog.Description className="dialog-description">
        This action cannot be undone. This will permanently delete your task and
        all track associated.
      </Dialog.Description>
      <br />
      <div className="flex">
        <Checkbox.Root
          id="c1"
          className="group flex size-[18px] flex-shrink-0 appearance-none items-center justify-center rounded bg-white outline-none outline-1 outline-offset-0 outline-[var(--gray)]"
          onCheckedChange={setChecked}
        >
          <Checkbox.Indicator>
            <CheckIcon />
          </Checkbox.Indicator>
          {!checked && (
            <CheckIcon className="hidden text-[var(--gray)] group-hover:block" />
          )}
        </Checkbox.Root>
        <label
          htmlFor="c1"
          className="warning-sm pl-[15px] hover:cursor-pointer"
        >
          I confirm that I want to delete this task
        </label>
      </div>

      <div className="dialog-bottom">
        <Dialog.Close asChild>
          <button
            className="button-accept"
            onClick={handleDeleteConfirm}
            disabled={checked === false}
          >
            Delete
          </button>
        </Dialog.Close>
      </div>
    </Dialog.Content>
  );
}
