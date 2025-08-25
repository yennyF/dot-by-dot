"use client";

import { ReactNode, useEffect } from "react";
import {
  CheckCircledIcon,
  GearIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useGroupStore } from "@/app/stores/GroupStore";
import { useTaskStore } from "@/app/stores/TaskStore";

export default function AppHeader({ children }: { children?: ReactNode }) {
  const router = useRouter();

  const groupSize = useGroupStore((s) => s.size);
  const taskSize = useTaskStore((s) => s.size);

  useEffect(() => {
    console.log("AppHeader rendered");
  });

  return (
    <header className="fixed left-0 top-0 z-30 flex h-[60px] w-full items-center gap-8 bg-[var(--background)] px-[20px]">
      <Logo />
      <button
        className="flex items-center gap-2"
        onClick={async () => {
          router.push("/about");
        }}
      >
        <InfoCircledIcon />
        About
      </button>
      {(groupSize > 0 || taskSize > 0) && (
        <button
          className="flex items-center gap-2"
          onClick={() => {
            router.push("/settings");
          }}
        >
          <GearIcon />
          Settings
        </button>
      )}
      {children}
    </header>
  );
}

function Logo() {
  const router = useRouter();

  return (
    <div
      className="app-Logo flex cursor-pointer items-center gap-2"
      onClick={() => {
        router.push("/");
      }}
    >
      <CheckCircledIcon />
      <span className="text-sm tracking-wider">
        <b>dot</b>
        <span className="px-[4px]">by</span>
        <b>dot</b>
        {/* TODO bit by bit? */}
      </span>
    </div>
  );
}
