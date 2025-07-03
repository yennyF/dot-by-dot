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
  addTask: (task: Task) => Promise<boolean>;
  renameTask: (id: string, newName: string) => Promise<boolean>;
  moveTask: (id: string, beforeId: string | null) => boolean;
  updateTask: (id: string, groupId: string | undefined) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  addGroup: (group: Group) => Promise<boolean>;
  renameGroup: (id: string, newName: string) => Promise<boolean>;
  moveGroup: (id: string, beforeId: string | null) => boolean;
  deleteGroup: (id: string) => Promise<boolean>;

  dummyTask: Task | undefined;
  setDummyTask: (task: Task | undefined) => void;
}

const AppContext = createContext({} as AppContextProps);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [groups, setGroups] = useState<Group[]>();
  const [tasks, setTasks] = useState<Task[]>();

  const [dummyTask, setDummyTask] = useState<Task>();

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

  const addTask = async (task: Task) => {
    if (!tasks) return false;

    try {
      setTasks([task, ...tasks]);
      await db.tasks.add(task);
    } catch (error) {
      console.error("Error adding task:", error);
      return false;
    }

    return true;
  };

  const renameTask = async (id: string, name: string) => {
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

  const updateTask = async (id: string, groupId: string | undefined) => {
    if (!tasks) return false;

    const task = tasks.find((task) => task.id === id);
    if (!task) return false;
    if (task.groupId === groupId) return true;

    task.groupId = groupId;

    try {
      await db.tasks.update(id, { groupId });
      setTasks([...tasks]);
    } catch (error) {
      console.error("Error updating task groupId:", error);
      return false;
    }

    return true;
  };

  const moveTask = (id: string, beforeId: string | null) => {
    if (!tasks) return false;
    if (beforeId === id) return true;

    const index = tasks.findIndex((task) => task.id === id);
    if (index < 0) return false;

    const deletedTasks = tasks.splice(index, 1);
    if (beforeId === null) {
      tasks.push(...deletedTasks);
    } else {
      const beforeIndex = tasks.findIndex((task) => task.id === beforeId);
      tasks.splice(beforeIndex, 0, ...deletedTasks);
    }
    setTasks([...tasks]);
    return true;
  };

  const deleteTask = async (id: string) => {
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

  const addGroup = async (group: Group) => {
    if (!groups) return false;

    try {
      setGroups([group, ...groups]);
      await db.groups.add(group);
    } catch (error) {
      console.error("Error adding group:", error);
      return false;
    }

    return true;
  };

  const renameGroup = async (id: string, name: string) => {
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

  const moveGroup = (id: string, beforeId: string | null) => {
    if (!groups) return false;
    if (beforeId === id) return true;

    const index = groups.findIndex((group) => group.id === id);
    if (index < 0) return false;

    const deletedGroups = groups.splice(index, 1);
    if (beforeId === null) {
      groups.push(...deletedGroups);
    } else {
      const beforeIndex = groups.findIndex((group) => group.id === beforeId);
      groups.splice(beforeIndex, 0, ...deletedGroups);
    }
    setGroups([...groups]);
    return true;
  };

  const deleteGroup = async (id: string) => {
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
    updateTask,
    deleteTask,
    addGroup,
    renameGroup,
    moveGroup,
    deleteGroup,

    dummyTask,
    setDummyTask,
  };

  return <AppContext value={value}>{children}</AppContext>;
};

export { AppContext, AppProvider };
