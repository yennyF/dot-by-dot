"use client";

import React, { use } from "react";
import { addDays } from "date-fns";
import { AppContext } from "../../AppContext";
import { Habit } from "../../repositories";
import { motion } from "motion/react";
import clsx from "clsx";

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
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }

  const { habitsByDate, toggleHabitTrack } = appContext;

  const isCurrentActive =
    habitsByDate[date.toLocaleDateString()]?.[habit.id] || false;
  const isPrevActive =
    habitsByDate[addDays(date, -1).toLocaleDateString()]?.[habit.id] || false;
  const isNextActive =
    habitsByDate[addDays(date, 1).toLocaleDateString()]?.[habit.id] || false;

  const handleTicked = async (date: Date, habitId: number) => {
    await toggleHabitTrack(date, habitId);
  };

  return (
    <div
      {...props}
      className={`relative flex items-center justify-center ${className}`}
    >
      {isPrevActive && isCurrentActive && (
        <div className="absolute left-0 right-[50%] h-4 bg-[var(--accent-4)]"></div>
      )}
      {isNextActive && isCurrentActive && (
        <div className="absolute left-[50%] right-0 h-4 bg-[var(--accent-4)]"></div>
      )}
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
          handleTicked(date, habit.id);
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
