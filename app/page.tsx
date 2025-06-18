"use client";

import { AppContext, AppProvider } from "./AppContext";
import { use, useState } from "react";
// import Navbar from "./components/Navbar";
import CalendarDay from "./components/CalendarDay/CalendarDay";
import CalendarMonth from "./components/CalendarMonth";
import { CalendarIcon, Cross1Icon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "motion/react";

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

  const [openSidebar, setOpenSidebar] = useState(true);

  if (!habits) {
    return <Loading />;
  }

  return (
    <div className="relative flex">
      <motion.div
        className="sidebar relative h-screen w-[320px] shrink-0"
        animate={{
          width: openSidebar ? "320px" : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="button-icon absolute right-[-40px] top-8 z-10 h-[40px] w-[40px] rounded-none bg-[var(--accent)]"
          onClick={() => setOpenSidebar((prev) => !prev)}
        >
          {openSidebar ? <Cross1Icon /> : <CalendarIcon />}
        </div>
        <AnimatePresence>
          {openSidebar && (
            <motion.div
              className="relative h-screen w-[320px] shrink-0"
              initial={{ left: -320 }}
              animate={{ left: 0 }}
              exit={{ left: -320 }}
              transition={{ duration: 0.2 }}
            >
              <div className="fixed mt-[80px] h-screen w-[320px] border-r-[1px] border-[var(--gray)]">
                <div className="flex w-full items-center justify-center">
                  <CalendarMonth />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mx-[50px] overflow-hidden">
        <CalendarDay />
      </div>
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
