"use client";

import { Popover } from "radix-ui";
import { ChangeEvent, KeyboardEvent, use, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { Group } from "../repositories/types";

interface GroupRenamePopoverProps {
  children: React.ReactNode;
  group: Group;
  onOpenChange?: (open: boolean) => void;
}

export default function GroupRenamePopover({
  children,
  group,
  onOpenChange,
}: GroupRenamePopoverProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onOpenChange?.(open);
  }, [onOpenChange, open]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      {open && (
        <Popover.Portal>
          <Content setOpen={setOpen} group={group} />
        </Popover.Portal>
      )}
    </Popover.Root>
  );
}

interface ContentProps {
  setOpen: (open: boolean) => void;
  group: Group;
}

function Content({ setOpen, group }: ContentProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("Content must be used within a AppProvider");
  }
  const { groups, renameGroup } = appContext;

  const [nameInput, setNameInput] = useState(group.name);
  const [isDuplicated, setIsDuplicated] = useState(false);

  useEffect(() => {
    if (!groups) return;
    if (groups.some((h) => h.id !== group.id && h.name === nameInput)) {
      setIsDuplicated(true);
    } else {
      setIsDuplicated(false);
    }
  }, [group, nameInput, groups]);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNameInput(event.target.value);
  };

  const handleSaveClick = async () => {
    if (await renameGroup(group.id, nameInput)) {
      setOpen(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveClick();
    }
  };

  return (
    <Popover.Content
      className="popover-content z-20 flex w-[350px] flex-col gap-3"
      side="bottom"
      sideOffset={10}
      align="center"
      alignOffset={0}
      onKeyDown={handleKeyDown}
    >
      <p>Rename the group</p>
      <fieldset className="flex flex-col gap-2">
        <input
          type="text"
          value={nameInput}
          onChange={handleNameChange}
          placeholder={group.name}
          className="basis-full"
        ></input>
        <div className="text-xs text-orange-500">
          {isDuplicated ? "This group is duplicated" : "\u00A0"}
        </div>
      </fieldset>
      <div className="flex justify-center gap-3">
        <Popover.Close>
          <div className="button-cancel">Cancel</div>
        </Popover.Close>
        <button
          className="button-accept"
          onClick={handleSaveClick}
          disabled={nameInput.length === 0 || nameInput === group.name}
        >
          Rename
        </button>
      </div>
      <Popover.Arrow className="arrow" />
    </Popover.Content>
  );
}
