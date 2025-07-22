import React, { createContext, useState, ReactNode } from "react";
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
  minDate: Date;
  maxDate: Date;
  totalYears: Date[];
  totalDays: Date[];
}

export const AppContext = createContext({} as AppContextProps);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>("light");

  const currentDate = new Date();
  const minDate = startOfMonth(subMonths(currentDate, 1));
  const maxDate = addDays(currentDate, 7);

  const totalYears = eachYearOfInterval({
    start: minDate,
    end: maxDate,
  });
  const totalDays = eachDayOfInterval({
    start: minDate,
    end: maxDate,
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = {
    theme,
    toggleTheme,
    minDate,
    maxDate,
    totalYears,
    totalDays,
  };

  return <AppContext value={value}>{children}</AppContext>;
};
