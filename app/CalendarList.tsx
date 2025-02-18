"use client"

import { use, useEffect, useRef, useState } from "react";
import { format, subMonths, eachDayOfInterval, addDays, isFuture, isFirstDayOfMonth, isSameDay, startOfMonth, EachDayOfIntervalResult } from "date-fns";
import { getHabitHistory, HabitHistoryType, updateHabitHitory } from "./api";
import useScrollTo from "./hooks/useScrollBottom";
import useOnScreen from "./hooks/useOnScreen";
import EditHabitsDialog from "./EditHabits/EditHabitsDialog";
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
        start: subMonths(currentDate, 12),
        end: addDays(currentDate, 5)
    });
    // const groupedByMonth = totalDays.reduce((acc: Record<string, EachDayOfIntervalResult<{
    //     start: Date;
    //     end: Date;
    // }, undefined>>, day) => {
    //     const monthKey = `${day.getFullYear()}-${day.getMonth()}`; // Group by year and month
    //     if (!acc[monthKey]) {
    //         acc[monthKey] = [];
    //     }
    //     acc[monthKey].push(day);
    //     return acc;
    // }, {});

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
                
            <div className={`grid gap-x-0 gap-y-0.5 w-fit`} style={{ gridTemplateColumns: `min-content min-content repeat(${habits.length}, 1fr` }}>
                {/* Header */}
                {["", "", ...habits].map((habit, index) => (
                    <div key={index} className="flex items-center justify-center sticky top-16 bg-neutral-950 h-16 max-w-[150px] px-1">
                        <p className="text-center text-nowrap text-ellipsis overflow-hidden">{habit}</p>
                    </div>
                ))}

                {/* Body */}
                {totalDays.map((date, index) => {
                    const track = habitHistory[date.toDateString()];
                    const currentMonth = format(date, "MMMM yyyy");
                    const isNewMonth = index === 0 || format(totalDays[index - 1], "MMMM yyyy") !== currentMonth;

                    return (
                        <>
                            {/* Month Header */}
                            {isNewMonth ?
                                <div className="flex sticky top-[120px]">
                                    {format(date, "MMMM")}
                                    <div className="absolute top-0 flex flex-col gap-1 bg-neutral-950 w-full">
                                        <div className="text-right font-bold">
                                            {format(date, "MMMM")}
                                        </div>
                                        <div className="text-right text-xs">
                                            {format(date, "yyyy")}
                                        </div>
                                    </div>
                                </div>
                                :
                                <div></div>
                            }

                            <div className="flex items-center justify-center pl-8 pr-10">
                                {format(date, "d")}
                            </div>

                            {habits.map((habit) => (
                                <div key={habit} className="grid place-items-center">
                                    {isFuture(date)
                                        ? undefined
                                        : <button
                                            className={`text-center rounded-full w-4 h-4 ${track?.[habit] === true ? "bg-amber-100" : "bg-neutral-800"} hover:bg-neutral-600 transition-all`}
                                            onClick={() => toogleHabit(date, habit)}
                                        ></button>
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
