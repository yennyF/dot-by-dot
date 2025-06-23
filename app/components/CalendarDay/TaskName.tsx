import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { DragEvent, use, useState } from "react";
import { AppContext } from "../../AppContext";
import DeleteTaskDialog from "../DeleteTaskDialog";
import RenameTaskPopover from "../RenameTaskPopover";
import { Task } from "../../repositories";
import clsx from "clsx";

interface TaskNameProps {
  task: Task;
}

export default function TaskName({ task }: TaskNameProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("TaskName must be used within a AppProvider");
  }
  const { deleteTask } = appContext;

  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e: DragEvent) => {
    // e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskId", task.id.toString());
    setDragging(true);
  };

  const handleDragEnd = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDeleteConfirm = async () => {
    await deleteTask(task.id);
  };

  return (
    <div
      className={clsx(
        "task-name draggable group flex w-full cursor-grab items-center justify-between gap-2 px-3 active:cursor-grabbing",
        "[&.highlight]:font-bold"
      )}
      draggable="true"
      data-id={task.id}
      onDragStart={(e) => handleDragStart(e)}
      onDragEnd={(e) => handleDragEnd(e)}
    >
      <div className="overflow-hidden text-ellipsis text-nowrap">
        {task.name}
      </div>
      {!dragging && (
        <div
          className="action-buttons hidden gap-1 group-hover:flex [&[data-state=open]]:flex"
          data-state={open ? "open" : "closed"}
        >
          <RenameTaskPopover task={task} onOpenChange={setOpen}>
            <button className="button-icon">
              <Pencil1Icon />
            </button>
          </RenameTaskPopover>
          <DeleteTaskDialog
            task={task}
            onOpenChange={setOpen}
            onConfirm={handleDeleteConfirm}
          >
            <button className="button-icon">
              <TrashIcon />
            </button>
          </DeleteTaskDialog>
        </div>
      )}
    </div>
  );
}
