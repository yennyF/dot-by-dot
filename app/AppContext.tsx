import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { initHabitHistory, initHabits, updateHabits } from './api';

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
        const habits = initHabits();;
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
        return true;
    };

    return <AppContext value={{ theme, toggleTheme, habits, addHabit, deleteHabit }}>{children}</AppContext>;
};

export { AppContext, AppProvider };