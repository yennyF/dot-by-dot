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
    return ["React", "JS", "LeetCode", "English", "Behavioral"];
}

export type HabitHistoryEntry = {
    [key: string]: boolean;
};

export function getHabitHistory(
    totalDays: EachDayOfIntervalResult<{
        start: Date;
        end: Date;
    }, undefined>,
    habits: string[]
) {
    const currentDate = new Date();
    const result: HabitHistoryEntry[] = [];

    totalDays.forEach((date) => {
        const items: HabitHistoryEntry = {};
        if (date < currentDate) {
            for (let habit of habits) {
                items[habit] = Math.random() > 0.5;
            }
        }
        result.push(items);
    });

    return result;
}