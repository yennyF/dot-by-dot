import React, { createContext, useState, ReactNode, useEffect } from "react";
import {
  getHabitHistory,
  initHabitHistory,
  initHabits,
  updateHabitHitory,
  updateHabits,
} from "./api";

type ThemeType = "light" | "dark";

interface AppContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  habits: string[];
  addHabit: (habit: string) => boolean;
  renameHabit: (habit: string, newHabit: string) => boolean;
  deleteHabit: (habit: string) => boolean;
}

const AppContext = createContext({} as AppContextProps);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [habits, setHabits] = useState<string[]>([]);

  useEffect(() => {
    const habits = initHabits();
    setHabits(habits);

    initHabitHistory(habits);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const addHabit = (habit: string) => {
    if (!habit.length) return false;
    if (habits.includes(habit)) return false;

    const newHabits = [...habits, habit];
    setHabits(newHabits);
    updateHabits(newHabits);
    return true;
  };

  const renameHabit = (habit: string, newHabit: string) => {
    if (!newHabit.length) return false;
    if (habits.includes(newHabit)) return false;

    const index = habits.indexOf(habit);
    if (index < 0) return false;

    const newHabits = [...habits];
    newHabits.splice(index, 1, newHabit);
    renameHabitHistory(habit, newHabit);
    updateHabits(newHabits);
    setHabits(newHabits);
    return true;
  };

  const deleteHabit = (habit: string) => {
    const index = habits.indexOf(habit);
    if (index < 0) return false;

    const newHabits = [...habits];
    newHabits.splice(index, 1);
    deleteHabitHistory(habit);
    updateHabits(newHabits);
    setHabits(newHabits);
    return true;
  };

  const renameHabitHistory = (habit: string, newHabit: string) => {
    const habitHistory = getHabitHistory();
    for (const date in habitHistory) {
      habitHistory[date][newHabit] = habitHistory[date][habit];
      delete habitHistory[date][habit];
    }
    updateHabitHitory(habitHistory);
  };

  const deleteHabitHistory = (habit: string) => {
    const habitHistory = getHabitHistory();
    for (const date in habitHistory) {
      delete habitHistory[date][habit];
    }
    updateHabitHitory(habitHistory);
  };

  return (
    <AppContext
      value={{ theme, toggleTheme, habits, addHabit, renameHabit, deleteHabit }}
    >
      {children}
    </AppContext>
  );
};

export { AppContext, AppProvider };
