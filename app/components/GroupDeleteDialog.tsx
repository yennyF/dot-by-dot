"use client";

import { Checkbox, Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import { Group } from "../repositories/types";
import { useGroupStore } from "../stores/GroupStore";
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
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      {open && (
        <Dialog.Portal>
          <Dialog.Overlay className="overlay">
            <Dialog.Content className="dialog-content">
              <div className="flex justify-between">
                <Dialog.Title className="dialog-title">
                  Delete your group
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button className="button-icon shrink-0">
                    <Cross1Icon />
                  </button>
                </Dialog.Close>
              </div>
              <Dialog.Description className="dialog-description">
                This will remove all content that was associated with this
                group.
              </Dialog.Description>
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
          </Dialog.Overlay>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}
