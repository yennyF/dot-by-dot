"use client";

import { ReactNode } from "react";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase/server";
import { useUserStore } from "../stores/userStore";

export default function AppHeader({ children }: { children?: ReactNode }) {
  const router = useRouter();

  return (
    <header className="app-AppHeader fixed left-0 top-0 z-30 flex h-[60px] w-full items-center gap-8 border-[1px] border-[var(--gray)] bg-[var(--background)] px-[20px]">
      <button
        className="flex items-center gap-2"
        onClick={() => {
          router.push("/");
        }}
      >
        <CheckCircledIcon />
        <span className="flex gap-1 text-sm tracking-wider">
          <b>dot</b>
          by
          <b>dot</b>
        </span>
      </button>
      <button
        className="flex items-center gap-2"
        onClick={() => {
          router.push("/about");
        }}
      >
        About
      </button>
      {children}
      <Session />
    </header>
  );
}

function Session() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);

  if (user === undefined) return null;

  return user ? (
    <button
      className="flex items-center gap-2"
      onClick={async () => {
        await supabase.auth.signOut();
      }}
    >
      Log out
    </button>
  ) : (
    <button
      className="flex items-center gap-2"
      onClick={() => {
        router.push("/login");
      }}
    >
      Log in
    </button>
  );
}
