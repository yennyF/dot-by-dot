"use client";

import { AppContext } from "../AppContext";
import { use } from "react";
import { CalendarIcon, ListBulletIcon } from "@radix-ui/react-icons";

export default function Navbar() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("Home must be used within a AppProvider");
  }
  const { page, setPage } = appContext;

  return (
    <div className="fixed top-0 z-10 flex h-16 w-full items-center justify-end bg-[var(--background)] px-6">
      {page === "grid" ? (
        <button className="button-accent" onClick={() => setPage("list")}>
          <CalendarIcon />
        </button>
      ) : (
        <button className="button-accent" onClick={() => setPage("grid")}>
          <ListBulletIcon />
        </button>
      )}
    </div>
  );
}
