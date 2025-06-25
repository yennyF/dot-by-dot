import React, { createContext, useState, ReactNode, useEffect } from "react";
import * as Repositories from "./repositories";
import { Task, Group } from "./repositories/types";

type ThemeType = "light" | "dark";

interface AppContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  groups: Group[] | undefined;
  tasks: Task[] | undefined;
  addTask: (task: string) => Promise<boolean>;
  renameTask: (id: number, newName: string) => Promise<boolean>;
  moveTask: (selectedIndex: number, targetIndex: number | null) => void;
  deleteTask: (id: number) => Promise<boolean>;
}

const AppContext = createContext({} as AppContextProps);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [groups, setGroups] = useState<Group[]>();
  const [tasks, setTasks] = useState<Task[]>();

  useEffect(() => {
    let mounted = true;

    (async () => {
      const groups = await Repositories.getGroups();
      const tasks = await Repositories.getTasks();
      if (mounted) {
        setGroups(groups);
        setTasks(tasks);
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
    if (!tasks) return false;
    if (!name.length) return false;
    if (tasks.some((h) => h.name === name)) return false;

    try {
      const task = await Repositories.addTask(name);
      const newTasks = [...tasks, task];
      setTasks(newTasks);
    } catch (error) {
      console.error("Error adding task:", error);
      return false;
    }

    return true;
  };

  const renameTask = async (id: number, newName: string) => {
    if (!tasks) return false;
    if (!newName.length) return false;
    if (tasks.some((h) => id !== h.id && h.name === newName)) return false;

    const index = tasks.findIndex((h) => h.id === id);
    if (index < 0) return false;

    try {
      const task = await Repositories.updateTask(id, newName);
      const newTasks = [...tasks];
      newTasks.splice(index, 1, task);
      setTasks(newTasks);
    } catch (error) {
      console.error("Error renaming task:", error);
      return false;
    }

    return true;
  };

  const moveTask = (taskId: number, beforeId: number | null) => {
    if (!tasks) return false;

    const newTasks = [...tasks];

    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    const task = tasks[taskIndex];
    newTasks.splice(taskIndex, 1);

    if (beforeId === null) {
      newTasks.push(task);
    } else {
      const beforeIndex = tasks.findIndex((task) => task.id === beforeId);
      newTasks.splice(beforeIndex, 0, task);
    }
    setTasks(newTasks);
  };

  const deleteTask = async (id: number) => {
    if (!tasks) return false;

    const index = tasks.findIndex((h) => h.id === id);
    if (index < 0) return false;

    try {
      await Repositories.deleteTask(id);
      const newTasks = [...tasks];
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
    groups,
    tasks,
    addTask,
    renameTask,
    moveTask,
    deleteTask,
  };

  return <AppContext value={value}>{children}</AppContext>;
};

export { AppContext, AppProvider };
