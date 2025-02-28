import React, { createContext, useState, ReactNode, useEffect } from "react";
import * as API from "./api";
import { Habit } from "./db";

type ThemeType = "light" | "dark";

interface AppContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  page: "grid" | "list";
  setPage: (page: "grid" | "list") => void;
  habits: Habit[];
  addHabit: (habit: string) => Promise<boolean>;
  renameHabit: (id: number, newName: string) => Promise<boolean>;
  moveHabit: (selectedIndex: number, targetIndex: number) => void;
  deleteHabit: (id: number) => Promise<boolean>;
}

const AppContext = createContext({} as AppContextProps);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [page, setPage] = useState<"grid" | "list">("grid");
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    (async () => {
      // await API.initHabits();
      // await API.initTrack();
      const habits = await API.getHabit();
      setHabits(habits);
    })();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const addHabit = async (name: string) => {
    if (!name.length) return false;
    if (habits.some((h) => h.name === name)) return false;

    try {
      const habit = await API.addHabit(name);
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
      const habit = await API.updateHabit(id, newName);
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
  };

  const deleteHabit = async (id: number) => {
    const index = habits.findIndex((h) => h.id === id);
    if (index < 0) return false;

    try {
      await API.deleteHabit(id);
      const newHabits = [...habits];
      newHabits.splice(index, 1);
      setHabits(newHabits);
    } catch (error) {
      console.error("Error deleting habit:", error);
      return false;
    }

    return true;
  };

  return (
    <AppContext
      value={{
        theme,
        toggleTheme,
        page,
        setPage,
        habits,
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
