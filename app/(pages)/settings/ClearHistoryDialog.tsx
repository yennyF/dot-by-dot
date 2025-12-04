"use client";

import { Checkbox, Dialog } from "radix-ui";
import { useState } from "react";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import {
  notifySuccessful,
  notifyDeleteError,
  debounceNotifyLoading,
} from "../../components/Notification";
import { useTaskLogStore } from "../../stores/taskLogStore";

const toastId = "toast-clear-loading";

interface ClearHistoryDialogProps {
  children: React.ReactNode;
}

export default function ClearHistoryDialog({
  children,
}: ClearHistoryDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="button-outline mt-[15px]" disabled={open}>
        {children}
      </Dialog.Trigger>
      {open && (
        <Dialog.Portal>
          <Dialog.Overlay className="overlay">
            <Content />
          </Dialog.Overlay>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}

function Content() {
  const [checked, setChecked] = useState<boolean | "indeterminate">(false);

  const deleteAllTaskLog = useTaskLogStore((s) => s.deleteAllTaskLog);

  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    const debouncedNotification = debounceNotifyLoading(toastId);

    try {
      await deleteAllTaskLog();
      debouncedNotification.cancel();
      toast.dismiss(toastId);
      notifySuccessful("Clear history successful");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      notifyDeleteError();
      setIsLoading(false);
    }
  }

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
        Once you delete your history, there is no going back. Please be certain.
      </Dialog.Description>
      <br />
      <div className="checkbox">
        <div className="flex h-[20px] items-center">
          <Checkbox.Root
            id="c1"
            className="checkbox-box group/checkbox"
            onCheckedChange={setChecked}
          >
            <Checkbox.Indicator>
              <CheckIcon />
            </Checkbox.Indicator>
            {!checked && (
              <CheckIcon className="checkbox-indicator-hover group-hover/checkbox:block" />
            )}
          </Checkbox.Root>
        </div>
        <label htmlFor="c1" className="checkbox-label warning-sm">
          I confirm that I want to clear my history
        </label>
      </div>

      <div className="dialog-bottom">
        <Dialog.Close asChild>
          <button
            className="button-accept"
            onClick={handleClick}
            disabled={checked === false || isLoading}
          >
            Clear
          </button>
        </Dialog.Close>
      </div>
    </Dialog.Content>
  );
}
