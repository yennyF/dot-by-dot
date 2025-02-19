"use client"

import { use, useEffect, useRef, useState } from "react";
import { format, subMonths, eachDayOfInterval, addDays, isFuture, endOfMonth, isFirstDayOfMonth, isToday, startOfMonth, isBefore } from "date-fns";
import { getHabitHistory, HabitHistoryType, updateHabitHitory } from "./api";
import useScrollTo from "./hooks/useScrollTo";
import useOnScreen from "./hooks/useOnScreen";
import EditHabitsDialog from "./EditHabits/EditHabitsDialog";
import { ArrowDownIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { AppContext } from "./AppContext";
import { eachMonthOfInterval } from "date-fns/fp";

const dayAfter = 6;

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
    const totalMonths = eachMonthOfInterval({
        start: subMonths(currentDate, 12),
        end: addDays(currentDate, dayAfter)
    });

    return (
        <>
            <div className="flex px-6 items-center justify-end fixed top-0 w-full h-16 bg-neutral-950 z-10">
                <EditHabitsDialog>
                    <button className="button-default">
                        <Pencil1Icon />
                        Edit Habits
                    </button>
                </EditHabitsDialog>
            </div>

            <div className="flex flex-col items-center">
                {/* Header */}
                <div className="sticky top-16 h-16 grid bg-neutral-950 z-10" style={{ gridTemplateColumns: `100px 100px repeat(${habits.length}, 110px` }}>
                    {["", "", ...habits].map((habit, index) => (
                        <div key={index} className="flex items-center justify-center px-1">
                            <p className="text-center text-nowrap text-ellipsis overflow-hidden">{habit}</p>
                        </div>
                    ))}
                </div>

                {/* Body */}
                <div className="mt-16">
                    {totalMonths.map((date, index) => {
                        let totalDays = eachDayOfInterval({
                            start: startOfMonth(date),
                            end: endOfMonth(date)
                        });
                        const daysAfterToday = addDays(currentDate, dayAfter);
                        totalDays = totalDays.filter(day => 
                            isBefore(day, daysAfterToday)
                        );

                        return (
                            <div key={index} className="flex">
                                {/* First Column: Sticky */}
                                <div className="sticky top-[130px] w-[100px] h-fit flex flex-col items-end">
                                    <div className="text-right font-bold">
                                        {format(date, "MMMM")}
                                    </div>
                                    <div className="text-right text-xs">
                                        {format(date, "yyyy")}
                                    </div>
                                </div>

                                {/* Other Columns */}
                                <div>
                                    {totalDays.map((day, index) => {
                                        const track = habitHistory[day.toDateString()];
                                        const istoday = isToday(day);
                                        return (
                                            <div key={index} className="relative">
                                                {istoday &&
                                                    // added the height as an offset for useScrollTo
                                                    <div ref={scrollTarget} className="absolute top-0 -left-[40px] font-bold text-rose-500 h-[200px]">
                                                        Today
                                                    </div>
                                                }
                                                <div key={index} className="grid" style={{ gridTemplateColumns: `100px repeat(${habits.length}, 110px` }}>
                                                    <div className={`grid place-items-center ${(isFirstDayOfMonth(day) || istoday) && "font-bold"} ${istoday && "text-rose-500"}`}>
                                                        {format(day, "d")}
                                                    </div>
                                                    {habits.map((habit) => (
                                                        <div key={habit} className="grid place-items-center">
                                                            {isFuture(day)
                                                                ? undefined
                                                                : <button
                                                                    className={`rounded-full w-4 h-4 ${track?.[habit] === true ? "bg-amber-100" : "bg-neutral-800"} hover:bg-neutral-600 transition-all`}
                                                                    onClick={() => toogleHabit(day, habit)}
                                                                ></button>
                                                            }
                                                        </div>
                                                    ))}
                                                    {/* Add more columns as needed */}
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {/* Add more rows as needed */}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="shadow-dark fixed bottom-0 flex items-center justify-center w-full h-[100px]">
                <button className={`button-more ${isVisible ? "opacity-0 pointer-events-none" : "opacity-100"}`} onClick={scrollToTarget}>
                    Today
                    <ArrowDownIcon />
                </button>
            </div>
        </>
    );
}
