"use client";

import { Checkbox, Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Group } from "@/app/repositories/types";
import { useGroupStore } from "@/app/stores/groupStore";

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
            <Content group={group} />
          </Dialog.Overlay>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}

function Content({ group }: { group: Group }) {
  const deleteGroup = useGroupStore((s) => s.deleteGroup);

  const [checked, setChecked] = useState<boolean | "indeterminate">(false);

  const handleDeleteConfirm = async () => {
    await deleteGroup(group.id);
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
        This action cannot be undone. This will permanently delete your group
        and all track associated.
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
          I confirm that I want to delete this group
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
