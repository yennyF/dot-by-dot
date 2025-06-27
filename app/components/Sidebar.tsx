"use client";

import { Cross1Icon, CalendarIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import CalendarMonth from "./CalendarMonth";

export default function Sidebar() {
  const [openSidebar, setOpenSidebar] = useState(true);

  return (
    <motion.div
      className="sidebar relative w-[320px] shrink-0"
      animate={{
        width: openSidebar ? "320px" : 0,
      }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="button-icon-accent absolute right-[-40px] top-8 z-10 h-[40px] w-[40px] rounded-none"
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
            <div className="fixed h-screen w-[320px] border-r-[1px] border-[var(--gray)]">
              <div className="mt-[80px] flex w-full items-center justify-center">
                <CalendarMonth />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
