"use client";

import { RefObject, useEffect } from "react";
import {
  ChevronRightIcon,
  GearIcon,
  PlusIcon,
  TriangleDownIcon,
} from "@radix-ui/react-icons";
import CreateDropdown from "./CreateDropdown";
import { Link } from "@/app/components/Scroll";
import LeftButton from "./LeftButton";
import SettingsDialog from "../SettingsDialog";
import SwitchLock from "./SwitchLock";

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
        <SettingsDialog>
          <button className="button-icon-sheer h-[28px] w-[28px]">
            <GearIcon />
          </button>
        </SettingsDialog>
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
