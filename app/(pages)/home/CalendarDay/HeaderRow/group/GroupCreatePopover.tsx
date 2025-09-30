"use client";

import { useGroupStore } from "@/app/stores/groupStore";
import { Popover } from "radix-ui";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

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
    <Popover.Root open={open} onOpenChange={setOpen}>
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
  const insertGroup = useGroupStore((s) => s.insertGroup);

  const [name, setName] = useState("");

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSaveClick = async () => {
    if (!dummyGroup) return;
    await insertGroup({ id: dummyGroup.id, name });
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
