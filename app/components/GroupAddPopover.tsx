"use client";

import { Popover } from "radix-ui";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useGroupStore } from "../stores/GroupStore";

interface GroupAddPopoverProps {
  children: React.ReactNode;
}

export default function GroupAddPopover({ children }: GroupAddPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger data-state={open ? "open" : "close"} asChild>
        {children}
      </Popover.Trigger>
      {open && (
        <Popover.Portal>
          <Content />
        </Popover.Portal>
      )}
    </Popover.Root>
  );
}

function Content() {
  const groups = useGroupStore((s) => s.groups);
  const addGroup = useGroupStore((s) => s.addGroup);

  const [name, setName] = useState("");
  const [isDuplicated, setIsDuplicated] = useState(false);

  useEffect(() => {
    if (groups === undefined) return;

    if (groups.some((h) => h.name === name)) {
      setIsDuplicated(true);
    } else {
      setIsDuplicated(false);
    }
  }, [name, groups]);

  const handleGroupInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSaveClick = async () => {
    if (await addGroup({ id: uuidv4(), name })) {
      setName("");
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
      align="end"
      alignOffset={0}
      onKeyDown={handleKeyDown}
    >
      <p className="">Enter a new group</p>
      <fieldset className="flex flex-col gap-2">
        <input
          type="text"
          value={name}
          onChange={handleGroupInputChange}
          placeholder="New group"
          className="basis-full"
        ></input>
        <div className="text-xs text-[var(--accent)]">
          {isDuplicated ? "This group already exists" : "\u00A0"}
        </div>
      </fieldset>
      <div className="flex justify-center gap-3">
        <Popover.Close>
          <div className="button-cancel">Cancel</div>
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
