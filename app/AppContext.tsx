import React, { createContext, useState, ReactNode, useEffect } from "react";
import { Task, Group } from "./repositories/types";
import { db } from "./repositories/db";
import {
  startOfMonth,
  subMonths,
  addDays,
  eachYearOfInterval,
  eachDayOfInterval,
} from "date-fns";

type ThemeType = "light" | "dark";

interface AppContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  totalYears: Date[];
  totalDays: Date[];
  groups: Group[] | undefined;
  tasks: Task[] | undefined;
  addTask: (task: string, groupId: number) => Promise<boolean>;
  renameTask: (id: number, newName: string) => Promise<boolean>;
  moveTask: (selectedIndex: number, targetIndex: number | null) => void;
  deleteTask: (id: number) => Promise<boolean>;
  addGroup: (task: string) => Promise<boolean>;
  renameGroup: (id: number, newName: string) => Promise<boolean>;
  moveGroup: (selectedIndex: number, targetIndex: number | null) => void;
  deleteGroup: (id: number) => Promise<boolean>;
}

const AppContext = createContext({} as AppContextProps);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [groups, setGroups] = useState<Group[]>();
  const [tasks, setTasks] = useState<Task[]>();

  const currentDate = new Date();
  const minDate = startOfMonth(subMonths(currentDate, 3));
  const maxDate = addDays(currentDate, 0);
  const totalYears = eachYearOfInterval({
    start: minDate,
    end: maxDate,
  });
  const totalDays = eachDayOfInterval({
    start: minDate,
    end: maxDate,
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      const groups = await db.groups.toArray();
      const tasks = await db.tasks.toArray();
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

  const addTask = async (name: string, groupId: number) => {
    if (!tasks) return false;
    if (!name.length) return false;

    try {
      const id = await db.tasks.add({ name, groupId });
      const task: Task = { id, name, groupId };
      setTasks([...tasks, task]);
    } catch (error) {
      console.error("Error adding task:", error);
      return false;
    }

    return true;
  };

  const renameTask = async (id: number, name: string) => {
    if (!tasks) return false;
    if (!name.length) return false;

    const index = tasks.findIndex((h) => h.id === id);
    if (index < 0) return false;

    try {
      await db.tasks.update(id, { name });
      tasks[index].name = name;
      setTasks([...tasks]);
    } catch (error) {
      console.error("Error renaming task:", error);
      return false;
    }

    return true;
  };

  const moveTask = (id: number, beforeId: number | null) => {
    if (!tasks) return false;

    const newTasks = [...tasks];

    const taskIndex = tasks.findIndex((task) => task.id === id);
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
      await db.tasks.delete(id);
      const newTasks = [...tasks];
      newTasks.splice(index, 1);
      setTasks(newTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
      return false;
    }

    return true;
  };

  const addGroup = async (name: string) => {
    if (!groups) return false;
    if (!name.length) return false;

    try {
      const id = await db.groups.add({ name });
      const group: Group = { id, name };
      setGroups([...groups, group]);
    } catch (error) {
      console.error("Error adding group:", error);
      return false;
    }

    return true;
  };

  const renameGroup = async (id: number, name: string) => {
    if (!groups) return false;
    if (!name.length) return false;

    const index = groups.findIndex((h) => h.id === id);
    if (index < 0) return false;

    try {
      await db.groups.update(id, { name });
      groups[index].name = name;
      setGroups([...groups]);
    } catch (error) {
      console.error("Error renaming group:", error);
      return false;
    }

    return true;
  };

  const moveGroup = (id: number, beforeId: number | null) => {
    if (!groups) return false;

    const newGroups = [...groups];

    const taskIndex = groups.findIndex((group) => group.id === id);
    const group = groups[taskIndex];
    newGroups.splice(taskIndex, 1);

    if (beforeId === null) {
      newGroups.push(group);
    } else {
      const beforeIndex = groups.findIndex((group) => group.id === beforeId);
      newGroups.splice(beforeIndex, 0, group);
    }
    setGroups(newGroups);
  };

  const deleteGroup = async (id: number) => {
    if (!groups) return false;

    const index = groups.findIndex((h) => h.id === id);
    if (index < 0) return false;

    try {
      await db.groups.delete(id);
      const newGroups = [...groups];
      newGroups.splice(index, 1);
      setGroups(newGroups);
    } catch (error) {
      console.error("Error deleting group:", error);
      return false;
    }

    return true;
  };

  const value = {
    theme,
    toggleTheme,
    totalYears,
    totalDays,
    groups,
    tasks,
    addTask,
    renameTask,
    moveTask,
    deleteTask,
    addGroup,
    renameGroup,
    moveGroup,
    deleteGroup,
  };

  return <AppContext value={value}>{children}</AppContext>;
};

export { AppContext, AppProvider };
