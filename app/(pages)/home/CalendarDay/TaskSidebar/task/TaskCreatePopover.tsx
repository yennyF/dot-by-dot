"use client";

import { useTaskStore } from "@/app/stores/taskStore";
import { Popover } from "radix-ui";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

interface TaskCreatePopoverProps {
  children: React.ReactNode;
}

export default function TaskCreatePopover({
  children,
}: TaskCreatePopoverProps) {
  const [open, setOpen] = useState(true);

  const setDummyTask = useTaskStore((s) => s.setDummyTask);

  useEffect(() => {
    if (!open) {
      setDummyTask(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
  const dummyTask = useTaskStore((s) => s.dummyTask);
  const insertTask = useTaskStore((s) => s.insertTask);

  const [name, setName] = useState("");

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSaveClick = () => {
    if (!dummyTask) return;
    insertTask({ id: dummyTask.id, name }, dummyTask.groupId);
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
      align="end"
      onKeyDown={handleKeyDown}
    >
      <p>Enter a new name</p>
      <fieldset className="flex flex-col gap-2">
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="New task"
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
