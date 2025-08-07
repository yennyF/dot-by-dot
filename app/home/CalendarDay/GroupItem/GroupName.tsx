import {
  CubeIcon,
  DotFilledIcon,
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import GroupDeleteDialog from "./GroupDeleteDialog";
import GroupRenamePopover from "./GroupRenamePopover";
import { Group } from "@/app/repositories/types";
import { v4 as uuidv4 } from "uuid";
import { useTaskStore } from "@/app/stores/TaskStore";
import { useState, DragEvent } from "react";
import clsx from "clsx";
import GroupCreatePopover from "./GroupCreatePopover";

interface GroupNameProps {
  group: Group;
  isDummy?: boolean;
}

export default function GroupName({ group, isDummy }: GroupNameProps) {
  const [forceShow, setForceShow] = useState(false);

  const setDummyTask = useTaskStore((s) => s.setDummyTask);

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.setData("sort", "group");
    e.dataTransfer.setData("groupId", group.id);
  };

  const handleDragEnd = (e: DragEvent) => {
    e.preventDefault();
  };

  const draggable = isDummy ? false : true;

  return (
    <div
      className={clsx(
        "app-GroupName group/name sticky left-0 z-[9] flex h-[40px] items-center justify-between gap-1 bg-[var(--background)]",
        draggable && "draggable cursor-grab active:cursor-grabbing"
      )}
      style={{ width: "var(--width-name)" }}
      draggable={draggable}
      data-id={group.id}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <DotFilledIcon className="h-[12px] w-[12px] shrink-0 opacity-0 group-hover/item:opacity-100" />
        <CubeIcon className="h-[12px] w-[12px] shrink-0" />
        <div className="overflow-hidden text-ellipsis text-nowrap font-bold">
          {group.name}
        </div>
      </div>
      <div
        className={clsx(
          "action-buttons gap-1",
          forceShow || isDummy ? "flex" : "hidden group-hover/name:flex"
        )}
      >
        {isDummy ? (
          <GroupCreatePopover>
            <button className="button-icon-sheer">
              <Pencil1Icon />
            </button>
          </GroupCreatePopover>
        ) : (
          <>
            <button
              className="button-icon-sheer"
              onClick={() => {
                setDummyTask({
                  id: uuidv4(),
                  name: "(No name)",
                  groupId: group.id,
                  order: "",
                });
              }}
            >
              <PlusIcon />
            </button>
            <GroupRenamePopover group={group} onOpenChange={setForceShow}>
              <button className="button-icon-sheer">
                <Pencil1Icon />
              </button>
            </GroupRenamePopover>
            <GroupDeleteDialog group={group} onOpenChange={setForceShow}>
              <button className="button-icon-sheer">
                <TrashIcon />
              </button>
            </GroupDeleteDialog>
          </>
        )}
      </div>
    </div>
  );
}
