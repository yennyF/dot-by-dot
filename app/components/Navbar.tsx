"use client";

import { AppContext } from "../AppContext";
import { use } from "react";
import { CalendarIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Switch } from "radix-ui";

export default function Navbar() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("Home must be used within a AppProvider");
  }
  const { page, setPage } = appContext;

  return (
    <div className="fixed top-0 z-10 flex h-16 w-full items-center justify-end gap-4 bg-[var(--background)] px-6">
      <CalendarIcon />
      <Switch.Root
        className="relative h-[25px] w-[42px] cursor-default rounded-full bg-black outline-none data-[state=checked]:bg-black"
        id="airplane-mode"
        style={{ "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)" }}
        checked={page === "list"}
        onCheckedChange={(checked: boolean) =>
          setPage(checked ? "list" : "grid")
        }
      >
        <Switch.Thumb className="block size-[21px] translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
      </Switch.Root>
      <HamburgerMenuIcon />
    </div>
  );
}
