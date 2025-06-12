"use client";

import { AppContext, AppProvider } from "./AppContext";
import { use } from "react";
// import Navbar from "./components/Navbar";
import CalendarDay from "./components/CalendarDay/CalendarDay";
import AddHabitPopover from "./components/AddHabitPopover";
import { PlusIcon } from "@radix-ui/react-icons";
import CalendarMonth from "./components/CalendarMonth";

export default function Home() {
  return (
    <AppProvider>
      {/* <Navbar /> */}
      <Content />
    </AppProvider>
  );
}

function Content() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("Home must be used within a AppProvider");
  }
  const { habits } = appContext;

  if (!habits) {
    return <Loading />;
  }

  return (
    <div className="flex">
      <div className="h-screen w-[320px] shrink-0">
        <div className="fixed top-0 h-screen w-[320px] border-r-[1px] border-[var(--gray)]">
          <AddHabitPopover>
            <button className="button-accent ml-[20px] mt-[20px]">
              <PlusIcon />
              New Habit
            </button>
          </AddHabitPopover>
          <div className="mt-[30px] flex w-full items-center justify-center">
            <CalendarMonth />
          </div>
        </div>
      </div>
      <CalendarDay />
    </div>
  );
}

function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-pulse">Loading...</div>
    </div>
  );
}
