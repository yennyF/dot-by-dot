"use client";

import React, { use } from "react";
import { addDays } from "date-fns";
import { AppContext } from "../../AppContext";
import TickedButton from "./TickedButton";
import { Habit } from "../../repositories";

interface TaskValueProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date;
  habit: Habit;
}

export function TaskValue({
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
      <TickedButton
        className="z-[1]"
        active={isCurrentActive}
        onClick={() => handleTicked(date, habit.id)}
      />
      {isNextActive && isCurrentActive && (
        <div className="absolute left-[50%] right-0 h-4 bg-[var(--accent-4)]"></div>
      )}
    </div>
  );
}
