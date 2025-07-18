"use client";

import { Popover } from "radix-ui";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { useGroupStore } from "../stores/GroupStore";

interface GroupCreatePopoverProps {
  children: React.ReactNode;
}

export default function GroupCreatePopover({
  children,
}: GroupCreatePopoverProps) {
  const [open, setOpen] = useState(true);

  const setDummyGroup = useGroupStore((s) => s.setDummyGroup);

  useEffect(() => {
    if (!open) {
      setDummyGroup(undefined);
    }
  }, [open, setDummyGroup]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      {open && (
        <Popover.Portal>
          <Content setOpen={setOpen} />
        </Popover.Portal>
      )}
    </Popover.Root>
  );
}

function Content({ setOpen }: { setOpen: (open: boolean) => void }) {
  const dummyGroup = useGroupStore((s) => s.dummyGroup);
  const groups = useGroupStore((s) => s.groups);
  const addGroup = useGroupStore((s) => s.addGroup);

  const [name, setName] = useState("");
  const [isDuplicated, setIsDuplicated] = useState(false);

  useEffect(() => {
    if (groups?.some((h) => h.name === name)) {
      setIsDuplicated(true);
    } else {
      setIsDuplicated(false);
    }
  }, [name, groups]);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSaveClick = async () => {
    if (!dummyGroup) return;
    await addGroup({ id: dummyGroup.id, name });
    setOpen(false);
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
      align="center"
      onKeyDown={handleKeyDown}
    >
      <p>Enter a new name</p>
      <fieldset className="flex flex-col gap-2">
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="New group"
        ></input>
        <div className="warning-xs">
          {isDuplicated ? "There is a group with the same name" : "\u00A0"}
        </div>
      </fieldset>
      <div className="flex justify-center gap-3">
        <Popover.Close>
          <div className="button-cancel">Discard</div>
        </Popover.Close>
        <Popover.Close
          className="button-accept flex-none"
          onClick={handleSaveClick}
          disabled={name.length === 0}
        >
          Add
        </Popover.Close>
      </div>
      <Popover.Arrow className="arrow" />
    </Popover.Content>
  );
}
