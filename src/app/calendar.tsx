"use client"

import { useState } from "react";
import { format, startOfMonth, endOfMonth, addMonths, subMonths, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek, isFuture } from "date-fns";
import './calendar.css';



export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfCurrentMonth = startOfMonth(currentDate);
    const endOfCurrentMonth = endOfMonth(currentDate);

    const startOfWeekDate = startOfWeek(startOfCurrentMonth);
    const endOfWeekDate = endOfWeek(endOfCurrentMonth);
    const totalDays = eachDayOfInterval({ start: startOfWeekDate, end: endOfWeekDate });

    const previousMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const monthName = format(currentDate, "MMMM yyyy");
    const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

    return (
        <div className="calendar flex flex-col items-center justify-center w-screen h-screen font-mono">
            <div className="w-fit h-fit">
                <div className="calendar-header w-full h-20 flex items-center justify-between gap-5">
                    <h2>{monthName}</h2>
                    <div className="flex gap-10">
                        <button onClick={() => {
                            setCurrentDate(new Date())
                        }}>Today</button>
                        <button onClick={previousMonth}>{"<"}</button>
                        <button onClick={nextMonth}>{">"}</button>
                    </div>
                </div>

                <div className="calendar-grid-header grid grid-cols-7 gap-2 text-neutral-400">
                    {dayLabels.map((day, index) => (
                        <div key={index} className="calendar-day calendar-day-header text-center w-16 h-10">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="calendar-grid grid grid-cols-7 gap-2">
                    {totalDays.map((day, index) => (
                        <div
                            key={index}
                            className={`
                                calendar-day rounded-full w-16 h-16 grid place-items-center
                                ${isToday(day) ? "today" : ""} 
                                ${isSameMonth(day, currentDate) ? "" : "other-month"} 
                                ${isFuture(day) ? "bg-neutral-950 text-neutral-700" : "bg-neutral-800"} 
                            `}
                        >
                            <div>{format(day, "d")}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}