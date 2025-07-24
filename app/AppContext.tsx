import React, { createContext, useState, ReactNode } from "react";
import {
  subMonths,
  addDays,
  eachYearOfInterval,
  eachDayOfInterval,
  subDays,
} from "date-fns";

type ThemeType = "light" | "dark";

interface AppContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  minDate: Date;
  maxDate: Date;
  decreaseMinDate: () => void;
  totalYears: Date[];
  totalDays: Date[];
}

export const AppContext = createContext({} as AppContextProps);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>("light");

  const currentDate = new Date();
  const [minDate, setMinDate] = useState<Date>(subDays(currentDate, 30));
  const [maxDate] = useState<Date>(addDays(currentDate, 7));

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

  const decreaseMinDate = () => {
    setMinDate((prev) => subMonths(prev, 1));
  };

  const value = {
    theme,
    toggleTheme,
    minDate,
    maxDate,
    decreaseMinDate,
    totalYears,
    totalDays,
  };

  return <AppContext value={value}>{children}</AppContext>;
};
