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
import {
  AppTooltip,
  AppTooltipTrigger,
  AppContentTrigger,
} from "@/app/components/AppTooltip";
import { useUIStore } from "@/app/stores/useUIStore";

interface GroupItemProps {
  group: Group;
}

function GroupItemWrapper({ group }: GroupItemProps) {
  const [forceShow, setForceShow] = useState(false);

  const setDummyTask = useTaskStore((s) => s.setDummyTask);

  const isOpen = useUIStore((s) => s.isGroupOpen(group.id));
  const toggleCollapsedGroup = useUIStore((s) => s.toggleCollapsedGroup);

  const handleClickNew = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!isOpen) {
      toggleCollapsedGroup(group.id);
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
        "app-GroupRow group/name sticky left-0 flex h-row items-center justify-between gap-1 bg-[var(--background)]",
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
        <AppTooltip>
          <AppTooltipTrigger asChild>
            <button className="button-icon-sheer" onClick={handleClickNew}>
              <PlusIcon />
            </button>
          </AppTooltipTrigger>
          <AppContentTrigger>New task</AppContentTrigger>
        </AppTooltip>

        <GroupRenamePopover group={group} onOpenChange={setForceShow}>
          <span onClick={(e) => e.stopPropagation()}>
            <AppTooltip>
              <AppTooltipTrigger asChild>
                <button className="button-icon-sheer">
                  <Pencil1Icon />
                </button>
              </AppTooltipTrigger>
              <AppContentTrigger>Rename</AppContentTrigger>
            </AppTooltip>
          </span>
        </GroupRenamePopover>

        <GroupDeleteDialog group={group} onOpenChange={setForceShow}>
          <span onClick={(e) => e.stopPropagation()}>
            <AppTooltip>
              <AppTooltipTrigger asChild>
                <button className="button-icon-sheer">
                  <TrashIcon />
                </button>
              </AppTooltipTrigger>
              <AppContentTrigger>Delete</AppContentTrigger>
            </AppTooltip>
          </span>
        </GroupDeleteDialog>

        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </div>
    </div>
  );
}

export function GroupItemDummy({ group }: { group: Group }) {
  return (
    <div className="app-GroupRow group/name sticky left-0 flex h-row items-center justify-between gap-1 bg-[var(--background)]">
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
