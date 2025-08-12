import {
  CubeIcon,
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Group } from "@/app/repositories/types";
import { v4 as uuidv4 } from "uuid";
import { useTaskStore } from "@/app/stores/TaskStore";
import { useState, DragEvent } from "react";
import clsx from "clsx";
import GroupCreatePopover from "./group/GroupCreatePopover";
import GroupDeleteDialog from "./group/GroupDeleteDialog";
import GroupRenamePopover from "./group/GroupRenamePopover";
import AppTooltip from "@/app/components/AppTooltip";

interface GroupRowProps {
  group: Group;
  isDummy?: boolean;
}

export default function GroupRow({ group, isDummy }: GroupRowProps) {
  const [forceShow, setForceShow] = useState(false);

  const setDummyTask = useTaskStore((s) => s.setDummyTask);

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.setData("sort", "group");
    e.dataTransfer.setData("groupId", group.id);
  };

  const handleDragEnd = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleClickNew = () => {
    setDummyTask({
      id: uuidv4(),
      name: "(No name)",
      groupId: group.id,
      order: "",
    });
  };

  const draggable = isDummy ? false : true;

  return (
    <div
      className={clsx(
        "app-GroupRow group/name h-row sticky left-0 flex items-center justify-between gap-1 bg-[var(--background)]",
        draggable && "draggable cursor-grab active:cursor-grabbing"
      )}
      draggable={draggable}
      data-id={group.id}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center gap-2 overflow-hidden">
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
            <AppTooltip content="New task" contentClassName="z-10" asChild>
              <button className="button-icon-sheer" onClick={handleClickNew}>
                <PlusIcon />
              </button>
            </AppTooltip>

            <GroupRenamePopover group={group} onOpenChange={setForceShow}>
              <span>
                <AppTooltip content="Rename" contentClassName="z-10" asChild>
                  <button className="button-icon-sheer">
                    <Pencil1Icon />
                  </button>
                </AppTooltip>
              </span>
            </GroupRenamePopover>

            <GroupDeleteDialog group={group} onOpenChange={setForceShow}>
              <span>
                <AppTooltip content="Delete" contentClassName="z-10" asChild>
                  <button className="button-icon-sheer">
                    <TrashIcon />
                  </button>
                </AppTooltip>
              </span>
            </GroupDeleteDialog>
          </>
        )}
      </div>
    </div>
  );
}
