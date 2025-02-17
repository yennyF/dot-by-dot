import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { getHabitHistory, initHabitHistory, initHabits, updateHabitHitory, updateHabits } from './api';
import { unset } from 'lodash';

type ThemeType = 'light' | 'dark';

interface AppContextProps {
    theme: ThemeType;
    toggleTheme: () => void;
    habits: string[];
    addHabit: (habit: string) => boolean;
    deleteHabit: (habit: string) => boolean;
}

const AppContext = createContext({} as AppContextProps);

const AppProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<ThemeType>('light');
    const [habits, setHabits] = useState<string[]>([]);

    useEffect(() => {
        const habits = initHabits();
        setHabits(habits);

        initHabitHistory(habits);
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const addHabit = (habit: string) => {
        if (!habit.length) return false;
        if (habits.includes(habit)) return false;
        
        const newHabits = [...habits, habit];
        setHabits(newHabits);
        updateHabits(newHabits);
        return true;
    };

    const deleteHabit = (habit: string) => {
        const index = habits.indexOf(habit);
        if (index < 0) return false;

        const newHabits = [...habits];
        newHabits.splice(index, 1);
        setHabits(newHabits);
        updateHabits(newHabits);
        deleteHabitHistory(habit);
        return true;
    };

    const deleteHabitHistory = (habit: string) => {
        const habitHistory = getHabitHistory();
        for (const date in habitHistory) {
            unset(habitHistory[date], habit);
        }
        updateHabitHitory({...habitHistory});
    };

    return <AppContext value={{ theme, toggleTheme, habits, addHabit, deleteHabit }}>{children}</AppContext>;
};

export { AppContext, AppProvider };