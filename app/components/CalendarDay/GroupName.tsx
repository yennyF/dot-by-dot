import { Pencil1Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import GroupDeleteDialog from "../GroupDeleteDialog";
import TaskAddPopover from "../TaskAddPopover";
import GroupRenamePopover from "../GroupRenamePopover";
import { Group } from "@/app/repositories/types";

interface GroupNameProps {
  group: Group;
}

export default function GroupName({ group }: GroupNameProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="task-name group sticky left-0 z-[9] flex w-full items-center justify-between gap-1 bg-[var(--background)] pl-2 pr-3">
      <div className="overflow-hidden text-ellipsis text-nowrap">
        {group.name}
      </div>
      <div
        className="action-buttons hidden gap-1 group-hover:flex [&[data-state=open]]:flex"
        data-state={open ? "open" : "closed"}
      >
        <TaskAddPopover group={group} onOpenChange={setOpen}>
          <button className="button-icon">
            <PlusIcon />
          </button>
        </TaskAddPopover>
        <GroupRenamePopover group={group} onOpenChange={setOpen}>
          <button className="button-icon">
            <Pencil1Icon />
          </button>
        </GroupRenamePopover>
        <GroupDeleteDialog group={group} onOpenChange={setOpen}>
          <button className="button-icon">
            <TrashIcon />
          </button>
        </GroupDeleteDialog>
      </div>
    </div>
  );
}
