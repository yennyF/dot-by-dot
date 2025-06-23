import React, { createContext, useState, ReactNode, useEffect } from "react";
import * as Repositories from "./repositories";
import { Task } from "./repositories/types";

type ThemeType = "light" | "dark";

interface AppContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  habits: Task[] | undefined;
  addTask: (task: string) => Promise<boolean>;
  renameTask: (id: number, newName: string) => Promise<boolean>;
  moveTask: (selectedIndex: number, targetIndex: number | null) => void;
  deleteTask: (id: number) => Promise<boolean>;
}

const AppContext = createContext({} as AppContextProps);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [habits, setTasks] = useState<Task[]>(); // undefined when loading

  useEffect(() => {
    let mounted = true;

    (async () => {
      const habits = await Repositories.getTask();
      if (mounted) {
        setTasks(habits);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const addTask = async (name: string) => {
    if (!habits) return false;
    if (!name.length) return false;
    if (habits.some((h) => h.name === name)) return false;

    try {
      const task = await Repositories.addTask(name);
      const newTasks = [...habits, task];
      setTasks(newTasks);
    } catch (error) {
      console.error("Error adding task:", error);
      return false;
    }

    return true;
  };

  const renameTask = async (id: number, newName: string) => {
    if (!habits) return false;
    if (!newName.length) return false;
    if (habits.some((h) => id !== h.id && h.name === newName)) return false;

    const index = habits.findIndex((h) => h.id === id);
    if (index < 0) return false;

    try {
      const task = await Repositories.updateTask(id, newName);
      const newTasks = [...habits];
      newTasks.splice(index, 1, task);
      setTasks(newTasks);
    } catch (error) {
      console.error("Error renaming task:", error);
      return false;
    }

    return true;
  };

  const moveTask = (taskId: number, beforeId: number | null) => {
    if (!habits) return false;

    const newTasks = [...habits];

    const habitIndex = habits.findIndex((task) => task.id === taskId);
    const task = habits[habitIndex];
    newTasks.splice(habitIndex, 1);

    if (beforeId === null) {
      newTasks.push(task);
    } else {
      const beforeIndex = habits.findIndex((task) => task.id === beforeId);
      newTasks.splice(beforeIndex, 0, task);
    }
    setTasks(newTasks);
  };

  const deleteTask = async (id: number) => {
    if (!habits) return false;

    const index = habits.findIndex((h) => h.id === id);
    if (index < 0) return false;

    try {
      await Repositories.deleteTask(id);
      const newTasks = [...habits];
      newTasks.splice(index, 1);
      setTasks(newTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
      return false;
    }

    return true;
  };

  const value = {
    theme,
    toggleTheme,
    habits,
    addTask,
    renameTask,
    moveTask,
    deleteTask,
  };

  return <AppContext value={value}>{children}</AppContext>;
};

export { AppContext, AppProvider };
