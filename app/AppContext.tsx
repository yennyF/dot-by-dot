import React, { createContext, useState, ReactNode, useEffect } from "react";
import * as Repositories from "./repositories";
import { Habit, HabitsByDate } from "./repositories/types";
type ThemeType = "light" | "dark";

interface AppContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  page: "grid" | "list";
  setPage: (page: "grid" | "list") => void;
  habits: Habit[];
  habitsByDate: HabitsByDate;
  toggleHabitTrack: (date: Date, habitId: number) => Promise<boolean>;
  addHabit: (habit: string) => Promise<boolean>;
  renameHabit: (id: number, newName: string) => Promise<boolean>;
  moveHabit: (selectedIndex: number, targetIndex: number) => void;
  deleteHabit: (id: number) => Promise<boolean>;
}

const AppContext = createContext({} as AppContextProps);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [page, setPage] = useState<"grid" | "list">("list");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitsByDate, setHabitsByDate] = useState<HabitsByDate>({});

  useEffect(() => {
    let mounted = true;

    (async () => {
      const habits = await Repositories.getHabit();
      const habitsByDate = await Repositories.getHabitsByDate();

      if (mounted) {
        setHabits(habits);
        setHabitsByDate(habitsByDate);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const addHabit = async (name: string) => {
    if (!name.length) return false;
    if (habits.some((h) => h.name === name)) return false;

    try {
      const habit = await Repositories.addHabit(name);
      const newHabits = [...habits, habit];
      setHabits(newHabits);
    } catch (error) {
      console.error("Error adding habit:", error);
      return false;
    }

    return true;
  };

  const renameHabit = async (id: number, newName: string) => {
    if (!newName.length) return false;
    if (habits.some((h) => id !== h.id && h.name === newName)) return false;

    const index = habits.findIndex((h) => h.id === id);
    if (index < 0) return false;

    try {
      const habit = await Repositories.updateHabit(id, newName);
      const newHabits = [...habits];
      newHabits.splice(index, 1, habit);
      setHabits(newHabits);
    } catch (error) {
      console.error("Error renaming habit:", error);
      return false;
    }

    return true;
  };

  const moveHabit = (selectedIndex: number, targetIndex: number) => {
    // const newHabits = [...habits];
    // const [draggedItem] = newHabits.splice(selectedIndex, 1);
    // newHabits.splice(targetIndex, 0, draggedItem);
    // setHabits(newHabits);
    console.log(selectedIndex, targetIndex);
  };

  const deleteHabit = async (id: number) => {
    const index = habits.findIndex((h) => h.id === id);
    if (index < 0) return false;

    try {
      await Repositories.deleteHabit(id);
      const newHabits = [...habits];
      newHabits.splice(index, 1);
      setHabits(newHabits);
    } catch (error) {
      console.error("Error deleting habit:", error);
      return false;
    }

    return true;
  };

  const toggleHabitTrack = async (date: Date, habitId: number) => {
    const dateString = date.toLocaleDateString();
    const isChecked = habitsByDate[dateString]?.[habitId] ?? false;

    await Repositories.setHabitByDate(habitId, !isChecked, date);

    try {
      setHabitsByDate((prev) => ({
        ...prev,
        [dateString]: {
          ...prev[dateString],
          [habitId]: !isChecked,
        },
      }));

      return true;
    } catch (error) {
      console.error("Error toggling habit track:", error);
      return false;
    }
  };

  return (
    <AppContext
      value={{
        theme,
        toggleTheme,
        page,
        setPage,
        habits,
        habitsByDate,
        toggleHabitTrack,
        addHabit,
        renameHabit,
        moveHabit,
        deleteHabit,
      }}
    >
      {children}
    </AppContext>
  );
};

export { AppContext, AppProvider };
