"use client";

import { DropdownMenu } from "radix-ui";
import { useGroupStore } from "../../stores/GroupStore";
import { useTaskStore } from "../../stores/TaskStore";
import { v4 as uuidv4 } from "uuid";
import { Link } from "../Scroll";

export default function CreateDropdown({
  children,
}: {
  children: React.ReactNode;
}) {
  const setDummyTask = useTaskStore((s) => s.setDummyTask);
  const setDummyGroup = useGroupStore((s) => s.setDummyGroup);

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="dropdown-content z-20 w-[160px]"
          side="bottom"
          align="start"
        >
          <DropdownMenu.Item
            className="dropdown-item"
            onClick={() => {
              setDummyGroup({ id: uuidv4(), name: "(No name)", order: "" });
            }}
          >
            <Link to="create-group" options={{ block: "center" }}>
              Group
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="dropdown-item"
            onClick={async () => {
              setDummyTask({ id: uuidv4(), name: "(No name)", order: "" });
            }}
          >
            <Link to="create-task" options={{ block: "center" }}>
              Task
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Arrow className="arrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
