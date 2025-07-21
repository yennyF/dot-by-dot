import { Pencil1Icon } from "@radix-ui/react-icons";
import { Group } from "@/app/repositories/types";
import GroupCreatePopover from "../GroupCreatePopover";

interface GroupNameDummyProps {
  group: Group;
}

export function GroupNameDummy({ group }: GroupNameDummyProps) {
  return (
    <div className="app-GroupNameDummy group sticky left-0 z-[9] flex w-full items-center justify-between gap-1 bg-[var(--background)]">
      <div className="overflow-hidden text-ellipsis text-nowrap font-bold">
        {group.name}
      </div>
      <div className="action-buttons">
        <GroupCreatePopover>
          <button className="button-icon-sheer">
            <Pencil1Icon />
          </button>
        </GroupCreatePopover>
      </div>
    </div>
  );
}
