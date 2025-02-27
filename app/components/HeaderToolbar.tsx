import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { ReactNode, use } from "react";
import styled from "styled-components";
import { AppContext } from "../AppContext";
import DeleteHabitDialog from "./DeleteHabitDialog";
import RenameHabitPopover from "./RenameHabitPopover";

const Trigger = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .button-icon {
    opacity: 0;

    &[data-state="open"] {
      opacity: 1;
    }
  }

  &:hover:not(.dragging) {
    .button-icon {
      opacity: 1;
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 2px;
  position: absolute;
  top: -15px;
`;

interface HeaderToolbarProps {
  children: ReactNode;
  habit: string;
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

  const handleDeleteConfirm = () => {
    deleteHabit(habit);
  };

  return (
    <Trigger className={dragging ? "dragging" : ""}>
      {children}
      <ButtonWrapper className="buttonWrapper">
        <RenameHabitPopover habit={habit}>
          <button className="button-icon">
            <Pencil1Icon />
          </button>
        </RenameHabitPopover>
        <DeleteHabitDialog habit={habit} onConfirm={handleDeleteConfirm}>
          <button className="button-icon">
            <TrashIcon />
          </button>
        </DeleteHabitDialog>
      </ButtonWrapper>
    </Trigger>
  );
}
