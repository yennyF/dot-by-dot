import { Pencil1Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { DragEvent, useState } from "react";
import DeleteGroupDialog from "../DeleteGroupDialog";
import AddTaskPopover from "../AddTaskPopover";
import clsx from "clsx";
import { Group } from "@/app/repositories";
import RenameGroupPopover from "../RenameGroupPopover";

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
      className={clsx(
        "task-name draggable group flex cursor-grab items-center justify-between gap-1 active:cursor-grabbing",
        "w-[200px] [&.highlight]:font-bold"
      )}
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
          <AddTaskPopover task={group} onOpenChange={setOpen}>
            <button className="button-icon">
              <PlusIcon />
            </button>
          </AddTaskPopover>
          <RenameGroupPopover group={group} onOpenChange={setOpen}>
            <button className="button-icon">
              <Pencil1Icon />
            </button>
          </RenameGroupPopover>
          <DeleteGroupDialog group={group} onOpenChange={setOpen}>
            <button className="button-icon">
              <TrashIcon />
            </button>
          </DeleteGroupDialog>
        </div>
      )}
    </div>
  );
}
