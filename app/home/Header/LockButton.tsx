"use client";

import { LockClosedIcon, LockOpen1Icon } from "@radix-ui/react-icons";
import { useTaskLogStore } from "@/app/stores/taskLogStore";
import {
  AppTooltip,
  AppTrigger,
  AppContent,
} from "@/app/components/AppTooltip";

export default function LockButton() {
  const unlock = useTaskLogStore((s) => s.unlock);
  const setUnlock = useTaskLogStore((s) => s.setUnlock);

  const handleCheckedChange = () => {
    setUnlock(!unlock);
  };

  return (
    <AppTooltip>
      <AppTrigger asChild>
        <button
          className="button-outline button-sm"
          onClick={handleCheckedChange}
        >
          {unlock ? <LockOpen1Icon /> : <LockClosedIcon />}
        </button>
      </AppTrigger>
      <AppContent align="end">
        {unlock
          ? "Lock previous track from changes"
          : "Allow updates to previous track"}
      </AppContent>
    </AppTooltip>
  );
}
