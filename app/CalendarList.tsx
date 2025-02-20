"use client";

import { use, useEffect, useRef, useState } from "react";
import {
	format,
	subMonths,
	eachDayOfInterval,
	addDays,
	isFuture,
	endOfMonth,
	isFirstDayOfMonth,
	isToday,
	startOfMonth,
	isBefore
} from "date-fns";
import { getHabitHistory, HabitHistoryType, updateHabitHitory } from "./api";
import useScrollTo from "./hooks/useScrollTo";
import useOnScreen from "./hooks/useOnScreen";
import EditHabitsDialog from "./EditHabits/EditHabitsDialog";
import { ArrowDownIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { AppContext } from "./AppContext";
import { eachMonthOfInterval } from "date-fns/fp";
import TickedButton from "./TickedButton/TickedButton";

const dayAfter = 6;

export default function CalendarList() {
	const appContext = use(AppContext);
	if (!appContext) {
		throw new Error("CalendarList must be used within a AppProvider");
	}
	const { habits } = appContext;

	const [habitHistory, setHabitHistory] = useState<HabitHistoryType>({});

	const scrollTarget = useRef<HTMLDivElement>(null);
	const scrollToTarget = useScrollTo(scrollTarget);
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
	};

	const currentDate = new Date();
	const totalMonths = eachMonthOfInterval({
		start: subMonths(currentDate, 12),
		end: addDays(currentDate, dayAfter)
	});

	return (
		<>
			<div className="fixed top-0 w-full h-16 px-6 flex items-center justify-end bg-[var(--background)] z-20">
				<EditHabitsDialog>
					<button className="button-main">
						<Pencil1Icon />
						Edit Habits
					</button>
				</EditHabitsDialog>
			</div>

			<div className="flex flex-col items-center">
				{/* Header */}
				<div
					className="sticky top-16 h-16 grid bg-[var(--background)] z-20"
					style={{
						gridTemplateColumns: `100px 100px repeat(${habits.length}, 110px)`
					}}
				>
					<div className="sticky left-0 bg-[var(--background)] z-20"></div>
					<div className="sticky left-[100px] bg-[var(--background)] z-20"></div>
					{habits.map((habit, index) => (
						<div key={index} className="px-1 flex items-center justify-center">
							<p className="text-center text-nowrap text-ellipsis overflow-hidden">
								{habit}
							</p>
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
						totalDays = totalDays.filter((day) =>
							isBefore(day, daysAfterToday)
						);
						return (
							<div key={index} className="flex">
								{/* First Column: Sticky */}
								<div className="sticky left-0 w-[100px] flex flex-col items-end bg-[var(--background)] z-10">
									<div className="sticky top-[130px] flex flex-col gap-y-1 text-right font-bold">
										{format(date, "MMMM")}
										<span className="text-xs">{format(date, "yyyy")}</span>
									</div>
								</div>
								{/* Other Columns */}
								<div>
									{totalDays.map((day, index) => {
										const track = habitHistory[day.toDateString()];
										const istoday = isToday(day);
										return (
											<div key={index} className="relative">
												{istoday && (
													// added the height as an offset for useScrollTo
													<div
														ref={scrollTarget}
														className="absolute top-0 -left-[40px] font-bold text-rose-500 h-[200px] z-10"
													>
														Today
													</div>
												)}
												<div
													key={index}
													className="grid"
													style={{
														gridTemplateColumns: `100px repeat(${habits.length}, 110px`
													}}
												>
													{/* Second Column: Sticky */}
													<div
														className={`sticky left-[100px] grid place-items-center bg-[var(--background)] z-10 ${
															(isFirstDayOfMonth(day) || istoday) && "font-bold"
														} ${istoday && "text-rose-500"}`}
													>
														{format(day, "dd")}
													</div>
													{/* Other Columns */}
													{habits.map((habit) => (
														<div
															key={habit}
															className="grid place-items-center"
														>
															{isFuture(day) ? undefined : (
																<TickedButton
																	active={track?.[habit] === true}
																	onClick={() => toogleHabit(day, habit)}
																/>
															)}
														</div>
													))}
													{/* Add more columns as needed */}
												</div>
											</div>
										);
									})}
									{/* Add more rows as needed */}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className="fixed bottom-0 w-full h-[100px] flex items-center justify-center shadow-dark">
				<button
					className={`button-main-outline ${
						isVisible ? "opacity-0 pointer-events-none" : "opacity-100"
					}`}
					onClick={scrollToTarget}
				>
					Today
					<ArrowDownIcon />
				</button>
			</div>
		</>
	);
}
