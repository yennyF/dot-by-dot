"use client";

import { LockClosedIcon, LockOpen1Icon } from "@radix-ui/react-icons";
import { useTaskLogStore } from "@/app/stores/taskLogStore";
import {
  AppTooltip,
  AppTrigger,
  AppContent,
} from "@/app/components/AppTooltip";

export default function LockButton() {
  const lock = useTaskLogStore((s) => s.lock);
  const setLock = useTaskLogStore((s) => s.setLock);

  const handleCheckedChange = () => {
    setLock(!lock);
  };

  return (
    <AppTooltip>
      <AppTrigger asChild>
        <button
          className="button-outline button-sm"
          onClick={handleCheckedChange}
        >
          {lock ? <LockClosedIcon /> : <LockOpen1Icon />}
        </button>
      </AppTrigger>
      <AppContent align="end">
        {lock
          ? "Allow updates to previous track"
          : "Lock previous track from changes"}
      </AppContent>
    </AppTooltip>
  );
}
