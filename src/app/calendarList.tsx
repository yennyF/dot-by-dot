"use client"

import { useEffect, useRef, useState } from "react";
import { format, subMonths, eachDayOfInterval, isToday, addDays } from "date-fns";
import './calendar.css';
import { getHabits, getHabitHistory, HabitHistoryEntry } from "./api";
import useScrollTo from "./hooks/useScrollBottom";
import useOnScreen from "./hooks/useOnScreen";

export default function CalendarList() {
    const currentDate = new Date();
    const startDate = subMonths(currentDate, 12);
    const endDate = addDays(currentDate, 5);
    const totalDays = eachDayOfInterval({ start: startDate, end: endDate });

    const [habits, setHabits] = useState<string[]>([]);
    const [habitHistory, sethabitHistory] = useState<HabitHistoryEntry[]>([]);

    const scrollTarget = useRef<HTMLDivElement>(null);
    const scrollToTarget = useScrollTo(scrollTarget, true, true);
    const isVisible = useOnScreen(scrollTarget);

    const toogleHabit = (index: number, habit: string) => {
        habitHistory[index][habit] = !habitHistory[index][habit];
        sethabitHistory([...habitHistory]);
    }

    useEffect(() => {
        const habits = getHabits();
        setHabits(habits);
        sethabitHistory(getHabitHistory(totalDays, habits));
    }, []);

    return (
        <div className="flex flex-col items-center">
            <div className={`list grid gap-1 w-fit`} style={{ gridTemplateColumns: `repeat(${habits.length + 1}, 1fr)` }}>
                {/* Header */}
                {["Day", ...habits].map((habit, index) => (
                    <div key={index} className="flex items-center justify-center sticky top-0 bg-neutral-950 h-20">
                        {habit}
                    </div>
                ))}

                {/* Body */}
                {habitHistory.map((item, index) => {
                    const date = totalDays[index];
                    return (
                        <>
                            <div key={index} className={`flex items-center text-left ${isToday(date) ? "today" : ""}`}>
                                {format(date, "MMMM") + ' ' + format(date, "d")}
                            </div>
                            {habits.map((habit) => (
                                <div key={habit} className="grid place-items-center">
                                    {item[habit] !== undefined ?
                                        <div
                                            className={`text-center rounded-full w-4 h-4 ${item[habit] === true ? "bg-amber-100" : "bg-neutral-800"}`}
                                            onClick={() => toogleHabit(index, habit)}
                                        ></div>
                                        : undefined
                                    }
                                </div>
                            ))}
                        </>
                    )
                })}
            </div>

            <div ref={scrollTarget} />

            <div className="scroll-shadow">
                <button className={`button-default fixed bottom-5 left-[50%] translate-x-[-50%] ${isVisible ? "opacity-0 pointer-events-none" : "opacity-100"}`} onClick={scrollToTarget}>Today</button>
            </div>
        </div>
    );
}
