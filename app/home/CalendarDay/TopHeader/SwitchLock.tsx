"use client";

import { useEffect, useRef } from "react";
import { LockClosedIcon, LockOpen1Icon } from "@radix-ui/react-icons";
import { useTrackStore } from "@/app/stores/TrackStore";
import { Switch } from "radix-ui";

export default function SwitchLock() {
  const unlock = useTrackStore((s) => s.unlock);
  const setUnlock = useTrackStore((s) => s.setUnlock);

  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  const handleCheckedChange = (checked: boolean) => {
    setUnlock(checked);

    if (checked) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      timeoutId.current = setTimeout(() => {
        setUnlock(false);
      }, 10000); // Auto-unlock after 10 seconds
    }
  };

  return (
    <Switch.Root
      className="relative h-[25px] w-[42px] cursor-pointer rounded-full bg-[var(--black)] outline-none data-[state=checked]:bg-[var(--accent)]"
      onCheckedChange={handleCheckedChange}
      checked={unlock}
    >
      <Switch.Thumb className="flex size-[21px] translate-x-0.5 items-center justify-center rounded-full bg-[var(--background)] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]">
        {unlock ? (
          <LockOpen1Icon className="w-[12px] text-[var(--accent)]" />
        ) : (
          <LockClosedIcon className="w-[12px] text-[var(--black)]" />
        )}
      </Switch.Thumb>
    </Switch.Root>
  );
}
