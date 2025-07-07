import { Pencil1Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import GroupDeleteDialog from "../GroupDeleteDialog";
import GroupRenamePopover from "../GroupRenamePopover";
import { Group } from "@/app/repositories/types";
import { v4 as uuidv4 } from "uuid";
import { useTaskStore } from "@/app/stores/TaskStore";
import { useState } from "react";
import clsx from "clsx";
import GroupAddPopover from "../GroupAddPopover";

interface GroupNameProps {
  group: Group;
}

export default function GroupName({ group }: GroupNameProps) {
  const [forceShow, setForceShow] = useState(false);

  const setDummyTask = useTaskStore((s) => s.setDummyTask);

  return (
    <div className="app-GroupName group sticky left-0 z-[9] flex w-full items-center justify-between gap-1 bg-[var(--background)] pl-2">
      <div className="overflow-hidden text-ellipsis text-nowrap font-bold">
        {group.name}
      </div>
      <div
        className={clsx(
          "action-buttons gap-1",
          forceShow ? "flex" : "hidden group-hover:flex"
        )}
      >
        <button
          className="button-icon"
          onClick={() => {
            setDummyTask({
              id: uuidv4(),
              name: "(No name)",
              groupId: group.id,
            });
          }}
        >
          <PlusIcon />
        </button>
        <GroupRenamePopover group={group} onOpenChange={setForceShow}>
          <button className="button-icon">
            <Pencil1Icon />
          </button>
        </GroupRenamePopover>
        <GroupDeleteDialog group={group} onOpenChange={setForceShow}>
          <button className="button-icon">
            <TrashIcon />
          </button>
        </GroupDeleteDialog>
      </div>
    </div>
  );
}

export function DummyGroupName({ group }: GroupNameProps) {
  return (
    <div className="app-DummyGroupName group sticky left-0 z-[9] flex w-full items-center justify-between gap-1 bg-[var(--background)] pl-2">
      <div className="overflow-hidden text-ellipsis text-nowrap font-bold">
        {group.name}
      </div>
      <div className="action-buttons">
        <GroupAddPopover>
          <button className="button-icon">
            <Pencil1Icon />
          </button>
        </GroupAddPopover>
      </div>
    </div>
  );
}
