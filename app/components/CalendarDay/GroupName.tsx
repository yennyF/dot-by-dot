import { Pencil1Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { DragEvent, useState } from "react";
import GroupDeleteDialog from "../GroupDeleteDialog";
import TaskAddPopover from "../TaskAddPopover";
import GroupRenamePopover from "../GroupRenamePopover";
import { Group } from "@/app/repositories/types";

interface GroupNameProps {
  group: Group;
}

export default function GroupName({ group }: GroupNameProps) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e: DragEvent) => {
    // e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskId", group.id.toString());
    setDragging(true);
  };

  const handleDragEnd = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  return (
    <div
      className={
        "task-name draggable group sticky left-0 z-[9] flex w-[200px] cursor-grab items-center justify-between gap-1 bg-[var(--background)] px-3 active:cursor-grabbing [&.highlight]:font-bold"
      }
      draggable="true"
      data-id={group.id}
      onDragStart={(e) => handleDragStart(e)}
      onDragEnd={(e) => handleDragEnd(e)}
    >
      <div className="overflow-hidden text-ellipsis text-nowrap">
        {group.name}
      </div>
      {!dragging && (
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
      )}
    </div>
  );
}
