"use client";

import { Cross1Icon, CalendarIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import CalendarMonth from "./CalendarMonth/CalendarMonth";
import { useGroupStore } from "../stores/GroupStore";

export default function Sidebar() {
  const [openSidebar, setOpenSidebar] = useState(true);
  const groups = useGroupStore((s) => s.groups);

  return (
    <motion.div
      className="sidebar relative w-[320px] shrink-0 border-l-[1px] border-[var(--gray)]"
      animate={{
        width: openSidebar ? "320px" : 0,
      }}
      transition={{ duration: 0.2 }}
    >
      {/* <div
        className="button-icon-sheer fixed right-[20px] top-[10px] z-40 h-[30px] w-[30px]"
        onClick={() => setOpenSidebar((prev) => !prev)}
      >
        {openSidebar ? <Cross1Icon /> : <CalendarIcon />}
      </div> */}

      <AnimatePresence>
        {openSidebar && (
          <motion.div
            className="relative h-screen w-[320px]"
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ duration: 0.2 }}
          >
            <div className="fixed h-screen w-[320px] overflow-scroll px-[10px] pt-[80px]">
              <div className="flex flex-col gap-20">
                <div className="flex w-full items-center justify-center">
                  <CalendarMonth />
                </div>
                {/* <div className="flex flex-col gap-2">
                  {groups?.map((g) => (
                    <div key={g.name} className="flex items-center gap-2">
                      <span className="w-[120px] shrink-0 text-nowrap text-sm">
                        {g.name}
                      </span>
                      <div className="h-4 flex-1 rounded-full bg-[var(--accent)]">
                        <div className="h-4 flex-1 rounded-full bg-[var(--accent)]"></div>
                      </div>
                    </div>
                  ))}
                </div> */}
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-end justify-center">
                    <span className="">17% task rate</span>
                  </div>
                  <div className="flex items-end justify-center">
                    <span className="">17 days total done</span>
                  </div>
                  <div className="flex items-end justify-center">
                    <span className="">17 days current strike</span>
                  </div>
                  <div className="flex items-end justify-center">
                    <span className="">17 days best strike</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
