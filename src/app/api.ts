import { EachDayOfIntervalResult } from "date-fns";

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

export function getHabits() {
    const str = localStorage.getItem('habits');
    
    if (str?.length) {    
        return JSON.parse(str);
    } else {
        const habits = ["React", "JS", "LeetCode", "English", "Behavioral"];
        updateHabits(habits);
        return habits;
    }
}

export function updateHabits(habits: string[]) {
    localStorage.setItem('habits', JSON.stringify(habits));
}

export type HabitHistoryEntry = {
    date: Date;
    track: Record<string, boolean>;
};

export function getHabitHistory(
    totalDays: EachDayOfIntervalResult<{
        start: Date;
        end: Date;
    }, undefined>
): HabitHistoryEntry[] {
    function buildHabitHistory() {
        const currentDate = new Date();
        const result: HabitHistoryEntry[] = [];
        const habits = getHabits();
    
        totalDays.forEach((date) => {
            const items: HabitHistoryEntry = {
                date,
                track: {}
            };
            if (date < currentDate) {
                for (let habit of habits) {
                    items.track[habit] = Math.random() > 0.5;
                }
            }
            result.push(items);
        });
    
        return result;
    }

    const str = localStorage.getItem('habitHistory');
    if (str?.length) {
        return JSON.parse(str);
    } else {
        const habitHistory = buildHabitHistory();
        updateHabitHitory(habitHistory);
        return habitHistory;
    }
}

export function updateHabitHitory(habitHistory: HabitHistoryEntry[]) {
    localStorage.setItem('habitHistory', JSON.stringify(habitHistory));
}