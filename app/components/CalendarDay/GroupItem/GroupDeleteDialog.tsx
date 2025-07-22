"use client";

import { Checkbox, AlertDialog } from "radix-ui";
import { useEffect, useState } from "react";
import { Group } from "../../../repositories/types";
import { useGroupStore } from "../../../stores/GroupStore";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";

interface GroupDeleteDialogProps {
  children: React.ReactNode;
  group: Group;
  onOpenChange?: (open: boolean) => void;
}

export default function GroupDeleteDialog({
  children,
  group,
  onOpenChange,
}: GroupDeleteDialogProps) {
  const deleteGroup = useGroupStore((s) => s.deleteGroup);

  const [open, setOpen] = useState(false);

  const [checked, setChecked] = useState<boolean | "indeterminate">(false);

  useEffect(() => {
    onOpenChange?.(open);
  }, [onOpenChange, open]);

  const handleDeleteConfirm = async () => {
    await deleteGroup(group.id);
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
      {open && (
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="overlay">
            <AlertDialog.Content className="dialog-content">
              <div className="flex justify-between">
                <AlertDialog.Title className="dialog-title">
                  Are you absolutely sure?
                </AlertDialog.Title>
                <AlertDialog.Cancel asChild>
                  <button className="button-icon-sheer shrink-0">
                    <Cross1Icon />
                  </button>
                </AlertDialog.Cancel>
              </div>
              <AlertDialog.Description className="dialog-description">
                This action cannot be undone. This will permanently delete your
                group and all track associated.
              </AlertDialog.Description>
              <br />
              <div className="flex gap-3">
                <Checkbox.Root
                  id="c1"
                  className="flex size-[18px] flex-shrink-0 appearance-none items-center justify-center rounded bg-white outline-none outline-1 outline-offset-0 outline-[var(--gray)]"
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
                  I confirm that I want to delete this group and all associated
                  content
                </label>
              </div>

              <div className="dialog-bottom">
                <AlertDialog.Cancel asChild>
                  <button
                    className="button-accept"
                    onClick={handleDeleteConfirm}
                    disabled={checked === false}
                  >
                    Delete
                  </button>
                </AlertDialog.Cancel>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Overlay>
        </AlertDialog.Portal>
      )}
    </AlertDialog.Root>
  );
}
