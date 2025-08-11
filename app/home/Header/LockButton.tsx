"use client";

import { LockClosedIcon, LockOpen1Icon } from "@radix-ui/react-icons";
import { useTrackStore } from "@/app/stores/TrackStore";
import AppTooltip from "@/app/components/AppTooltip";

export default function LockButton() {
  const unlock = useTrackStore((s) => s.unlock);
  const setUnlock = useTrackStore((s) => s.setUnlock);

  const handleCheckedChange = () => {
    setUnlock(!unlock);
  };

  return (
    <AppTooltip
      content={unlock ? "Lock track" : "Unlock track"}
      contentClassName="z-40"
      asChild
    >
      <button
        className="button-outline button-sm"
        onClick={handleCheckedChange}
      >
        {unlock ? <LockOpen1Icon /> : <LockClosedIcon />}
      </button>
    </AppTooltip>
  );
}
