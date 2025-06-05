import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { DragEvent, ReactNode, use, useState } from "react";
import styled from "styled-components";
import { AppContext } from "../AppContext";
import DeleteHabitDialog from "./DeleteHabitDialog";
import RenameHabitPopover from "./RenameHabitPopover";
import { Habit } from "../repositories";

const Trigger = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 10px;

  .buttonWrapper {
    display: none;
  }

  &[data-state="open"] {
    .buttonWrapper {
      display: flex;
    }
  }

  &:hover .buttonWrapper {
    display: flex;
  }
`;

interface HeaderToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  habit: Habit;
}

export default function HeaderToolbar({
  habit,
  className,
  ...props
}: HeaderToolbarProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("HeaderToolbar must be used within a AppProvider");
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
    <Trigger
      {...props}
      className={`${className} draggable cursor-grab rounded-md bg-[var(--background)] px-3 active:cursor-grabbing`}
      draggable="true"
      data-state={open ? "open" : "closed"}
      onDragStart={(e) => handleDragStart(e)}
      onDragEnd={(e) => handleDragEnd(e)}
    >
      <div className="overflow-hidden text-ellipsis text-nowrap">
        {habit.name}
      </div>
      {!dragging && (
        <div className="buttonWrapper flex gap-1">
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
    </Trigger>
  );
}
