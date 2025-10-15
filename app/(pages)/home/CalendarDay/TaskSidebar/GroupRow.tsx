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
  AppTrigger,
  AppContent,
} from "@/app/components/AppTooltip";
import { useUIStore } from "@/app/stores/useUIStore";

interface GroupRowProps {
  group: Group;
  isDummy?: boolean;
}

function GroupRowWrapper({ group, isDummy }: GroupRowProps) {
  return (
    <GroupRowDraggable group={group}>
      <GroupRowName group={group} />
      <GroupRowOptions group={group} isDummy={isDummy} />
    </GroupRowDraggable>
  );
}

function GroupRowDraggable({
  group,
  children,
}: {
  group: Group;
  children: React.ReactNode;
}) {
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
      {children}
    </div>
  );
}

function GroupRowName({ group }: { group: Group }) {
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <CubeIcon className="size-[12px] shrink-0" />
      <div className="overflow-hidden text-ellipsis text-nowrap font-bold">
        {group.name}
      </div>
    </div>
  );
}

function GroupRowOptions({
  group,
  isDummy,
}: {
  group: Group;
  isDummy?: boolean;
}) {
  const [forceShow, setForceShow] = useState(false);

  const setDummyTask = useTaskStore((s) => s.setDummyTask);

  const open = useUIStore((s) =>
    s.collapsedGroups.includes(group.id) ? false : true
  );
  const toggleCollapsedGroup = useUIStore((s) => s.toggleCollapsedGroup);

  const handleClickNew = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!open) {
      toggleCollapsedGroup(group.id);
    }

    setDummyTask({
      id: uuidv4(),
      name: "(No name)",
      groupId: group.id,
      order: "",
    });
  };

  return (
    <div
      className={clsx(
        "action-buttons items-center gap-1",
        forceShow || isDummy ? "flex" : "hidden group-hover/name:flex"
      )}
    >
      {isDummy ? (
        <GroupCreatePopover>
          <button className="button-icon-sheer">
            <Pencil1Icon />
          </button>
        </GroupCreatePopover>
      ) : (
        <>
          <AppTooltip>
            <AppTrigger asChild>
              <button className="button-icon-sheer" onClick={handleClickNew}>
                <PlusIcon />
              </button>
            </AppTrigger>
            <AppContent>New task</AppContent>
          </AppTooltip>

          <GroupRenamePopover group={group} onOpenChange={setForceShow}>
            <span onClick={(e) => e.stopPropagation()}>
              <AppTooltip>
                <AppTrigger asChild>
                  <button className="button-icon-sheer">
                    <Pencil1Icon />
                  </button>
                </AppTrigger>
                <AppContent>Rename</AppContent>
              </AppTooltip>
            </span>
          </GroupRenamePopover>

          <GroupDeleteDialog group={group} onOpenChange={setForceShow}>
            <span onClick={(e) => e.stopPropagation()}>
              <AppTooltip>
                <AppTrigger asChild>
                  <button className="button-icon-sheer">
                    <TrashIcon />
                  </button>
                </AppTrigger>
                <AppContent>Delete</AppContent>
              </AppTooltip>
            </span>
          </GroupDeleteDialog>

          {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </>
      )}
    </div>
  );
}

const GroupRow = memo(GroupRowWrapper);
export default GroupRow;
