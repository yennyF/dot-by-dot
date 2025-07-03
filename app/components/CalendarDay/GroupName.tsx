import { Pencil1Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { use, useState } from "react";
import GroupDeleteDialog from "../GroupDeleteDialog";
import GroupRenamePopover from "../GroupRenamePopover";
import { Group } from "@/app/repositories/types";
import { AppContext } from "@/app/AppContext";
import { v4 as uuidv4 } from "uuid";

interface GroupNameProps {
  group: Group;
}

export default function GroupName({ group }: GroupNameProps) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { setDummyTask } = appContext;

  const [open, setOpen] = useState(false);

  return (
    <div className="task-name group sticky left-0 z-[9] flex w-full items-center justify-between gap-1 bg-[var(--background)] pl-2">
      <div className="overflow-hidden text-ellipsis text-nowrap font-bold">
        {group.name}
      </div>
      <div
        className="action-buttons hidden gap-1 group-hover:flex [&[data-state=open]]:flex"
        data-state={open ? "open" : "closed"}
      >
        <button
          className="button-icon"
          onClick={() => {
            setDummyTask({
              id: uuidv4(),
              name: "(No Name)",
              groupId: group.id,
            });
          }}
        >
          <PlusIcon />
        </button>
        <GroupRenamePopover group={group} onOpenChange={setOpen}>
          <button className="button-icon">
            <Pencil1Icon />
          </button>
        </GroupRenamePopover>
        <GroupDeleteDialog group={group} onOpenChange={setOpen}>
          <button className="button-icon">
            <TrashIcon />
          </button>
        </GroupDeleteDialog>
      </div>
    </div>
  );
}
