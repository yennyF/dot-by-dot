"use client";

import { ReactNode, useEffect } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import MenuDropdown from "./MenuDropdown";
import SwitchMode from "./SwitchMode";

export default function AppHeader({ children }: { children?: ReactNode }) {
  useEffect(() => {
    console.log("AppHeader rendered");
  });

  return (
    <header className="fixed left-0 top-0 z-30 flex h-[70px] w-full items-center gap-2 bg-[var(--background)] px-[20px]">
      <MenuDropdown>
        <button className="button-outline button-sm">
          <HamburgerMenuIcon />
        </button>
      </MenuDropdown>
      <SwitchMode />
      {children}
    </header>
  );
}
