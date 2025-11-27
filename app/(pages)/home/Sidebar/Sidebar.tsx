import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useUIStore } from "@/app/stores/useUIStore";

export default function Sidebar() {
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);

  return (
    <motion.div
      animate={{ width: isSidebarOpen ? "fit-content" : 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="sticky top-0 h-screen w-[420px] shrink-0 overflow-scroll border-r-2 border-solid border-[var(--gray-5)] px-[40px] pt-[100px]"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
          >
            WIP
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
