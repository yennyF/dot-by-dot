import {
  ChevronDownIcon,
  ChevronUpIcon,
  CubeIcon,
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Group } from "@/app/types";
import { v4 as uuidv4 } from "uuid";
import { useTaskStore } from "@/app/stores/taskStore";
import { useState, DragEvent, memo } from "react";
import clsx from "clsx";
import GroupCreatePopover from "./group/GroupCreatePopover";
import GroupDeleteDialog from "./group/GroupDeleteDialog";
import GroupRenamePopover from "./group/GroupRenamePopover";
import { Tooltip } from "radix-ui";
import stylesTooltip from "@/app/styles/tooltip.module.scss";
import { useUIStore } from "@/app/stores/useUIStore";

interface GroupItemProps {
  group: Group;
}

function GroupItemWrapper({ group }: GroupItemProps) {
  const [forceShow, setForceShow] = useState(false);

  const setDummyTask = useTaskStore((s) => s.setDummyTask);

  const isOpen = useUIStore((s) => s.isGroupOpen(group.id));
  const toggleGroup = useUIStore((s) => s.toggleGroup);

  const handleClickNew = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!isOpen) {
      toggleGroup(group.id);
    }

    setDummyTask({
      id: uuidv4(),
      name: "(No name)",
      groupId: group.id,
      order: "",
    });
  };

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.setData("sort", "group");
    e.dataTransfer.setData("groupId", group.id);
  };

  const handleDragEnd = (e: DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={clsx(
        "app-GroupRow group/name sticky left-0 flex h-[var(--height-row-view)] items-center justify-between gap-1 bg-[var(--background)]",
        "draggable active:cursor-grabbing"
      )}
      draggable={true}
      data-id={group.id}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <GroupItemName name={group.name} />
      <div
        className={clsx(
          "items-center gap-1",
          forceShow ? "flex" : "hidden group-hover/name:flex"
        )}
      >
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button className="button-icon-sheer" onClick={handleClickNew}>
                <PlusIcon />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className={stylesTooltip.content}
                align="center"
                side="bottom"
                sideOffset={5}
              >
                New task
                <Tooltip.Arrow className={stylesTooltip.arrow} />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>

        <GroupRenamePopover group={group} onOpenChange={setForceShow}>
          <span onClick={(e) => e.stopPropagation()}>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button className="button-icon-sheer">
                    <Pencil1Icon />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className={stylesTooltip.content}
                    align="center"
                    side="bottom"
                    sideOffset={5}
                  >
                    Rename
                    <Tooltip.Arrow className={stylesTooltip.arrow} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </span>
        </GroupRenamePopover>

        <GroupDeleteDialog group={group} onOpenChange={setForceShow}>
          <span onClick={(e) => e.stopPropagation()}>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button className="button-icon-sheer">
                    <TrashIcon />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className={stylesTooltip.content}
                    align="center"
                    side="bottom"
                    sideOffset={5}
                  >
                    Delete
                    <Tooltip.Arrow className={stylesTooltip.arrow} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </span>
        </GroupDeleteDialog>

        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </div>
    </div>
  );
}

export function GroupItemDummy({ group }: { group: Group }) {
  return (
    <div className="app-GroupRow group/name sticky left-0 flex h-[var(--height-row-view)] items-center justify-between gap-1 bg-[var(--background)]">
      <GroupItemName name={group.name} />
      <div>
        <GroupCreatePopover>
          <button className="button-icon-sheer">
            <Pencil1Icon />
          </button>
        </GroupCreatePopover>
      </div>
    </div>
  );
}

function GroupItemName({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <CubeIcon className="size-[12px] shrink-0" />
      <span className="overflow-hidden text-ellipsis text-nowrap font-bold">
        {name}
      </span>
    </div>
  );
}

const GroupItem = memo(GroupItemWrapper);
export default GroupItem;
