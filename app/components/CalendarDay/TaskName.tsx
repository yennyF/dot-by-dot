import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { DragEvent, use, useState } from "react";
import { AppContext } from "../../AppContext";
import DeleteHabitDialog from "../DeleteHabitDialog";
import RenameHabitPopover from "../RenameHabitPopover";
import { Habit } from "../../repositories";
import clsx from "clsx";

interface TaskNameProps {
  habit: Habit;
}

export default function TaskName({ habit }: TaskNameProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("TaskName must be used within a AppProvider");
  }
  const { deleteHabit } = appContext;

  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e: DragEvent) => {
    // e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("habitId", habit.id.toString());
    setDragging(true);
  };

  const handleDragEnd = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDeleteConfirm = async () => {
    await deleteHabit(habit.id);
  };

  return (
    <div
      className={clsx(
        "task-name draggable group flex w-full cursor-grab items-center justify-between gap-2 px-3 active:cursor-grabbing",
        "[&.highlight]:font-bold"
      )}
      draggable="true"
      data-id={habit.id}
      onDragStart={(e) => handleDragStart(e)}
      onDragEnd={(e) => handleDragEnd(e)}
    >
      <div className="overflow-hidden text-ellipsis text-nowrap">
        {habit.name}
      </div>
      {!dragging && (
        <div
          className="action-buttons hidden gap-1 group-hover:flex [&[data-state=open]]:flex"
          data-state={open ? "open" : "closed"}
        >
          <RenameHabitPopover habit={habit} onOpenChange={setOpen}>
            <button className="button-icon">
              <Pencil1Icon />
            </button>
          </RenameHabitPopover>
          <DeleteHabitDialog
            habit={habit}
            onOpenChange={setOpen}
            onConfirm={handleDeleteConfirm}
          >
            <button className="button-icon">
              <TrashIcon />
            </button>
          </DeleteHabitDialog>
        </div>
      )}
    </div>
  );
}
