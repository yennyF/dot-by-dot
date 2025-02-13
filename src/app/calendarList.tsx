"use client"

import { use, useEffect, useRef, useState } from "react";
import { format, subMonths, eachDayOfInterval, isToday, addDays, isFuture, isFirstDayOfMonth, isSameDay, isAfter, startOfMonth, subYears } from "date-fns";
import './calendar.css';
import { getHabitHistory, HabitHistoryType, updateHabitHitory } from "./api";
import useScrollTo from "./hooks/useScrollBottom";
import useOnScreen from "./hooks/useOnScreen";
import EditHabitsDialog from "./EditHabitsDialog";
import { ArrowDownIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { AppContext } from "./AppContext";

export default function CalendarList() {
    const appContext = use(AppContext);
    if (!appContext) {
        throw new Error('CalendarList must be used within a AppProvider');
    }
    const { habits } = appContext;

    const [habitHistory, setHabitHistory] = useState<HabitHistoryType>({});

    const scrollTarget = useRef<HTMLDivElement>(null);
    const scrollToTarget = useScrollTo(scrollTarget, true, true);
    const isVisible = useOnScreen(scrollTarget);

    useEffect(() => {
        setHabitHistory(getHabitHistory());
    }, []);

    const toogleHabit = (date: Date, habit: string) => {
        const dateString = date.toDateString();

        if (!habitHistory[dateString]) {
            habitHistory[dateString] = {};
        }

        const value: boolean = habitHistory[dateString][habit] ?? false;
        habitHistory[dateString][habit] = !value;
        setHabitHistory({ ...habitHistory });
        updateHabitHitory(habitHistory);
    }

    const currentDate = new Date();
    const totalDays = eachDayOfInterval({
        start: subMonths(currentDate, 3),
        end: addDays(currentDate, 5)
    });

    return (
        <div className="flex flex-col items-center p-16">
            <div className="menu flex px-6 items-center justify-end fixed top-0 w-full h-16 bg-neutral-950">
                <EditHabitsDialog>
                    <button className="button-default">
                        <Pencil1Icon />
                        Edit Habits
                    </button>
                </EditHabitsDialog>
            </div>

            <div className={`grid gap-x-0.5 gap-y-0 w-fit`} style={{ gridTemplateColumns: `repeat(${habits.length + 2}, 1fr)` }}>
                {/* Header */}
                {["", "", ...habits].map((habit, index) => (
                    <div key={index} className="flex items-center justify-center sticky top-16 bg-neutral-950 h-16">
                        {habit}
                    </div>
                ))}

                {/* Body */}
                {totalDays.map((date) => {
                    const track = habitHistory[date.toDateString()];
                    return (
                        <>
                            {isFirstDayOfMonth(date) ?
                                <div className="flex items-center justify-end bg-neutral-950 sticky top-[120px]">
                                    {format(date, "MMMM")}
                                </div>
                                :
                                isSameDay(date, addDays((startOfMonth(date)), 1)) ?
                                    <div className="flex items-center justify-end bg-neutral-950 sticky top-[145px] text-xs">
                                        {format(date, "yyyy")}
                                    </div>
                                    :
                                    <div></div>
                            }

                            <div className="flex items-center justify-center">
                                {format(date, "d")}
                            </div>
                            
                            {habits.map((habit) => (
                                <div key={habit} className="grid place-items-center">
                                    {isFuture(date)
                                        ? undefined
                                        : <div
                                            className={`text-center rounded-full w-4 h-4 ${track?.[habit] === true ? "bg-amber-100" : "bg-neutral-800"}`}
                                            onClick={() => toogleHabit(date, habit)}
                                        ></div>
                                    }
                                </div>
                            ))}
                        </>
                    )
                })}
            </div>

            <div ref={scrollTarget} />

            <div className="shadow-dark fixed bottom-0 flex items-center justify-center w-full h-[100px]">
                <button className={`button-more ${isVisible ? "opacity-0 pointer-events-none" : "opacity-100"}`} onClick={scrollToTarget}>
                    Today
                    <ArrowDownIcon />
                </button>
            </div>
        </div>
    );
}
