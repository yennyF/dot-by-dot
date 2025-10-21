"use client";

import { ReactNode } from "react";
import { CheckCircledIcon, PersonIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "../stores/userStore";
import ProfileDropdown from "../(pages)/home/Header/ProfileDropdown";

export default function AppHeader({ children }: { children?: ReactNode }) {
  const router = useRouter();
  const user = useUserStore((s) => s.user);

  return (
    <header className="app-AppHeader fixed left-0 top-0 z-30 flex h-[60px] w-full items-center justify-between gap-4 border-[1px] border-[var(--gray)] bg-[var(--background)] px-[20px]">
      <button
        className="flex items-center gap-2"
        onClick={() => {
          if (user) {
            router.push("/home");
          } else {
            router.push("/product");
          }
        }}
      >
        <CheckCircledIcon />
        <span className="flex gap-1 text-sm tracking-wider">
          <b>dot</b>
          by
          <b>dot</b>
        </span>
      </button>
      <About />
      {children}
      <Session />
    </header>
  );
}

function About() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname !== "/product") {
    return null;
  }

  return (
    <div className="flex-1">
      <button
        className="flex items-center gap-2"
        onClick={() => {
          router.push("/about");
        }}
      >
        About
      </button>
    </div>
  );
}

function Session() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const pathname = usePathname();

  if (user === undefined || pathname === "/login" || pathname === "/signUp") {
    return null;
  }

  return user ? (
    <ProfileDropdown>
      <button className="button-outline button-sm">
        <PersonIcon />
      </button>
    </ProfileDropdown>
  ) : (
    <div className="flex gap-4">
      <button
        className="button-sheer button-sm"
        onClick={() => {
          router.push("/login");
        }}
      >
        Log in
      </button>
      <button
        className="button-accent-outline button-sm"
        onClick={() => {
          router.push("/signUp");
        }}
      >
        Get started
      </button>
    </div>
  );
}
