"use client";

import { LockClosedIcon, LockOpen1Icon } from "@radix-ui/react-icons";
import { useTrackStore } from "@/app/stores/TrackStore";
import { Tooltip } from "radix-ui";

export default function LockButton() {
  const unlock = useTrackStore((s) => s.unlock);
  const setUnlock = useTrackStore((s) => s.setUnlock);

  const handleCheckedChange = () => {
    setUnlock(!unlock);
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            className="button-outline button-sm"
            onClick={handleCheckedChange}
          >
            {unlock ? <LockOpen1Icon /> : <LockClosedIcon />}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="tooltip-content z-40"
            side="bottom"
            sideOffset={5}
          >
            {unlock ? "Lock track" : "Unlock track"}
            <Tooltip.Arrow className="tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
