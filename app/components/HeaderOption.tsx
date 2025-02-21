import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { ReactNode, use } from "react";
import styled from "styled-components";
import { AppContext } from "../AppContext";
import DeleteHabit from "./DeleteHabit";
import RenameHabit from "./RenameHabit";

const Trigger = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover .buttonWrapper {
    opacity: 1; /* Show the button on hover */
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 2px;
  position: absolute;
  top: -15px;
  opacity: 0;
`;

interface HeaderOptionProps {
  children: ReactNode;
  habit: string;
}

export default function HeaderOption({ children, habit }: HeaderOptionProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("DialogContent must be used within a AppProvider");
  }
  const { deleteHabit } = appContext;

  const handleDeleteHabitClick = (habit: string) => {
    deleteHabit(habit);
  };

  return (
    <Trigger>
      {children}
      <ButtonWrapper className="buttonWrapper">
        <RenameHabit habit={habit}>
          <button className="button-icon">
            <Pencil1Icon />
          </button>
        </RenameHabit>
        <DeleteHabit
          habit={habit}
          onConfirm={() => {
            handleDeleteHabitClick(habit);
          }}
        >
          <button className="button-icon">
            <TrashIcon />
          </button>
        </DeleteHabit>
      </ButtonWrapper>
    </Trigger>
  );
}
