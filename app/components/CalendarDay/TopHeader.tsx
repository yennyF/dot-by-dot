"use client";

import { RefObject, useEffect, useRef } from "react";
import {
  ChevronRightIcon,
  LockClosedIcon,
  LockOpen1Icon,
  PlusIcon,
  TriangleDownIcon,
} from "@radix-ui/react-icons";
import CreateDropdown from "./CreateDropdown";
import { Link } from "@/app/components/Scroll";
import LeftButton from "./LeftButton";
import { useTrackStore } from "@/app/stores/TrackStore";
import { Switch } from "radix-ui";

export default function TopHeader({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  useEffect(() => {
    console.log("Controls rendered");
  });

  return (
    <div className="sticky left-0 top-0 z-30 flex h-[70px] items-center justify-between gap-2 bg-[var(--background)] px-[20px]">
      <div className="flex items-center gap-4">
        <CreateDropdown>
          <button className="button-accent-outline">
            <PlusIcon />
            Create
            <TriangleDownIcon />
          </button>
        </CreateDropdown>
        <SwitchLock />
      </div>
      <div className="flex items-center gap-2">
        <LeftButton scrollRef={scrollRef} />
        <Link
          to="element-today"
          options={{ block: "end", behavior: "smooth", inline: "start" }}
          autoScroll={true}
        >
          <button className="button-outline">
            Today
            <ChevronRightIcon />
          </button>
        </Link>
      </div>
    </div>
  );
}

function SwitchLock() {
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
    <div className="flex items-center gap-2">
      {/* <label>Lock</label> */}
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
    </div>
  );
}
