import React, { createContext, useState, ReactNode, useEffect } from "react";
import * as API from "./api";
import { Habit } from "./db";
import { HabitTrack } from "./api";

type ThemeType = "light" | "dark";

interface AppContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  page: "grid" | "list";
  setPage: (page: "grid" | "list") => void;
  habits: Habit[];
  habitTracks: HabitTrack;
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
  const [habitTracks, setHabitTracks] = useState<HabitTrack>({});

  useEffect(() => {
    let mounted = true;

    (async () => {
      const habits = await API.getHabit();
      const habitTracks = await API.getHabitTrack();

      if (mounted) {
        setHabits(habits);
        setHabitTracks(habitTracks);
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
    console.log(selectedIndex, targetIndex);
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

  const toggleHabitTrack = async (date: Date, habitId: number) => {
    const dateString = date.toLocaleDateString();

    try {
      if (!habitTracks[dateString]) {
        const track = await API.addTrack(date);
        setHabitTracks((prev) => ({
          ...prev,
          [dateString]: {
            trackId: track.id,
            habits: {},
          },
        }));
        return toggleHabitTrack(date, habitId);
      }

      const trackId = habitTracks[dateString].trackId;
      const isTracked = habitTracks[dateString].habits[habitId];

      if (isTracked) {
        await API.deleteHabitTrack(habitId, trackId);
      } else {
        await API.addHabitTrack(habitId, trackId);
      }

      setHabitTracks((prev) => ({
        ...prev,
        [dateString]: {
          ...prev[dateString],
          habits: {
            ...prev[dateString].habits,
            [habitId]: !isTracked,
          },
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
        habitTracks,
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
