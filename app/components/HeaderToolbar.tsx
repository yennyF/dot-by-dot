import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { ReactNode, use, useState } from "react";
import styled from "styled-components";
import { AppContext } from "../AppContext";
import DeleteHabitDialog from "./DeleteHabitDialog";
import RenameHabitPopover from "./RenameHabitPopover";
import { Habit } from "../repositories";

const Trigger = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
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

  &:hover:not(.dragging) {
    .button-icon {
    }
  }
`;

interface HeaderToolbarProps {
  children: ReactNode;
  habit: Habit;
  dragging: boolean;
}

export default function HeaderToolbar({
  children,
  habit,
  dragging,
}: HeaderToolbarProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("HeaderToolbar must be used within a AppProvider");
  }
  const { deleteHabit } = appContext;

  const [open, setOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    await deleteHabit(habit.id);
  };

  return (
    <Trigger
      className={dragging ? "dragging" : ""}
      data-state={open ? "open" : "closed"}
    >
      {children}
      <div className="buttonWrapper flex gap-1 pr-2">
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
    </Trigger>
  );
}
