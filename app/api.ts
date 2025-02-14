import { eachDayOfInterval, EachDayOfIntervalResult, subDays, subMonths } from "date-fns";

export function generateRandomDaysForMonth(
    totalDays: EachDayOfIntervalResult<{
        start: Date;
        end: Date;
    }, undefined>
) {
    const currentDate = new Date();
    const result: { day: number; value: boolean; }[] = [];

    totalDays.forEach((day) => {
        const dayOfMonth = day.getDate();

        if (day < currentDate) {
            result.push({ day: dayOfMonth, value: Math.random() > 0.5 });
        } else {
            result.push({ day: dayOfMonth, value: false });
        }
    });

    return result;
}

// Habit

const habitsKey = 'habits';

export function initHabits() {
    const habits = ["React", "JS", "LeetCode", "English", "Behavioral"];
    localStorage.setItem(habitsKey, JSON.stringify(habits));
    return habits;
}

export function getHabits(): string[] {
    const str = localStorage.getItem(habitsKey);
    return str ? JSON.parse(str) : [];
}

export function updateHabits(habits: string[]) {
    localStorage.setItem(habitsKey, JSON.stringify(habits));
}

// HabitHistory

const habitHistoryKey = 'habitHistory';
export type TrackHabitType = Record<string, boolean>;
export type HabitHistoryType = Record<string, TrackHabitType>;

export function initHabitHistory(habits: string[]) {
    const currentDate = new Date();
    const totalDays = eachDayOfInterval({
        start: subMonths(currentDate, 1),
        end: subDays(currentDate, 1)
    });
    const habitHistory: HabitHistoryType = {};
    
    totalDays.forEach((date) => {
        const dateString = date.toDateString();
        habitHistory[dateString] = {};
        for (const habit of habits) {
            habitHistory[dateString][habit] = Math.random() > 0.5;
        }
    });

    localStorage.setItem(habitHistoryKey, JSON.stringify(habitHistory));
    return habitHistory;
}

export function getHabitHistory(): HabitHistoryType {
    const str = localStorage.getItem(habitHistoryKey);
    return str ? JSON.parse(str) : [];
}

export function updateHabitHitory(habitHistory: HabitHistoryType) {
    localStorage.setItem(habitHistoryKey, JSON.stringify(habitHistory));
}