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
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/app/supabase/server";
import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { useGroupStore } from "@/app/stores/groupStore";
import { useTaskStore } from "@/app/stores/taskStore";

const toastId = "toast-reset-loading";

interface ResetDialogProps {
  children: React.ReactNode;
}

export default function ResetDialog({ children }: ResetDialogProps) {
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

  const destroyTaskLogs = useTaskLogStore((s) => s.destroyTaskLogs);
  const destroyTasks = useTaskStore((s) => s.destroyTasks);
  const destroyGroups = useGroupStore((s) => s.destroyGroups);

  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    const debouncedNotification = debounceNotifyLoading(toastId);

    try {
      await Promise.all([
        supabase.from("task_logs").delete().neq("task_id", uuidv4()),
        supabase.from("tasks").delete().neq("id", uuidv4()),
        supabase.from("groups").delete().neq("id", uuidv4()),
        destroyTaskLogs(),
        destroyTasks(),
        destroyGroups(),
      ]);

      debouncedNotification.cancel();
      toast.dismiss(toastId);
      notifySuccessful("Reset successful");
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
        Once you reset your account, there is no going back. Please be certain.
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
          I confirm that I want to reset my account
        </label>
      </div>

      <div className="dialog-bottom">
        <Dialog.Close asChild>
          <button
            className="button-accept"
            onClick={handleClick}
            disabled={checked === false || isLoading}
          >
            Reset
          </button>
        </Dialog.Close>
      </div>
    </Dialog.Content>
  );
}
