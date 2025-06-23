"use client";

import React from "react";
import { addDays } from "date-fns";
import { Habit } from "../../repositories";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import { useStore } from "@/app/Store";

interface TaskValueProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date;
  habit: Habit;
}

export default function TaskValue({
  date,
  habit,
  className,
  ...props
}: TaskValueProps) {
  const dateSet = useStore((s) => s.habitGroup?.[habit.id]);
  const setHabitChecked = useStore((s) => s.setHabitChecked);

  const isCurrentActive = dateSet?.has(date.toLocaleDateString());
  const isPrevActive = dateSet?.has(addDays(date, -1).toLocaleDateString());
  const isNextActive = dateSet?.has(addDays(date, 1).toLocaleDateString());

  return (
    <div
      {...props}
      className={`relative flex items-center justify-center ${className}`}
    >
      <AnimatePresence>
        {isPrevActive && isCurrentActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 right-[50%] h-4 bg-[var(--accent-4)]"
          ></motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isNextActive && isCurrentActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-[50%] right-0 h-4 bg-[var(--accent-4)]"
          ></motion.div>
        )}
      </AnimatePresence>
      <motion.button
        className={clsx(
          "z-[1] h-4 w-4 rounded-full",
          isCurrentActive
            ? "bg-[var(--accent)]"
            : "bg-[var(--gray)] hover:bg-[var(--accent-5)]"
        )}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
        onClick={() => {
          setHabitChecked(date, habit.id, !isCurrentActive);
        }}
        onMouseEnter={() => {
          const el = document.querySelector(
            `.task-name[data-id="${habit.id}"]`
          );
          el?.classList.add("highlight");
        }}
        onMouseLeave={() => {
          const el = document.querySelector(
            `.task-name[data-id="${habit.id}"]`
          );
          el?.classList.remove("highlight");
        }}
      ></motion.button>
    </div>
  );
}
