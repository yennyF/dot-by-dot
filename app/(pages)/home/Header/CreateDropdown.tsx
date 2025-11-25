"use client";

import { DropdownMenu } from "radix-ui";
import { useGroupStore } from "../../../stores/groupStore";
import { useTaskStore } from "../../../stores/taskStore";
import { v4 as uuidv4 } from "uuid";
import { CircleIcon, CubeIcon } from "@radix-ui/react-icons";

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
          className="dropdown-content z-30 w-[160px]"
          side="bottom"
          align="end"
        >
          <DropdownMenu.Item
            className="dropdown-item dropdown-item-icon"
            onClick={() => {
              setDummyGroup({ id: uuidv4(), name: "(No name)", order: "" });
            }}
          >
            <CubeIcon />
            New group
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="dropdown-item dropdown-item-icon"
            onClick={async () => {
              setDummyTask({
                id: uuidv4(),
                name: "(No name)",
                order: "",
                groupId: null,
              });
            }}
          >
            <CircleIcon />
            New task
          </DropdownMenu.Item>
          <DropdownMenu.Arrow className="arrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
