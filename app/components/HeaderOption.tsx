import { TrashIcon } from "@radix-ui/react-icons";
import { ReactNode, use } from "react";
import styled from "styled-components";
import { AppContext } from "../AppContext";
import DeleteConfirm from "./DeleteConfirm";

const Trigger = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover .button {
    opacity: 1; /* Show the button on hover */
  }
`;

const Button = styled.button`
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
      <DeleteConfirm
        habit={habit}
        onConfirm={() => {
          handleDeleteHabitClick(habit);
        }}
      >
        <Button className="button button-icon">
          <TrashIcon />
        </Button>
      </DeleteConfirm>
    </Trigger>
  );
}
