"use client";

import { RefObject, use, useEffect, useRef } from "react";
import { AppContext } from "../../AppContext";
import {
  LockClosedIcon,
  LockOpen1Icon,
  PlusIcon,
  TriangleDownIcon,
} from "@radix-ui/react-icons";
import CreateDropdown from "./CreateDropdown";
import DraggableScroll from "./Draggable/DraggableScroll";
import YearItem from "./YearItem/YearItem";
import { Link } from "@/app/components/Scroll";
import UngroupedTasks from "./UngroupedTasks";
import GroupedTasks from "./GroupedTasks";
import { useTrackStore } from "@/app/stores/TrackStore";
import clsx from "clsx";
import LoadMore from "./LoadMore";

export default function CalendarDay() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarDay must be used within a AppProvider");
  }
  const { totalYears } = appContext;

  const lock = useTrackStore((s) => s.lock);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("CalendarDay rendered");
  });

  return (
    <div
      ref={scrollRef}
      className="app-CalendarDay relative h-[100vh] flex-1 overflow-scroll"
    >
      <Header scrollRef={scrollRef} />

      <div className={clsx("calendar flex w-fit", lock && "lock")}>
        {/* Fake left padding */}
        <div className="sticky left-0 top-[80px] z-20 w-[50px] shrink-0 bg-[var(--background)]"></div>

        <div>
          {/* Calendar header */}
          <div className="calendar-header sticky top-[80px] z-10 flex w-fit">
            <div className="sticky left-[50px] z-10 flex w-[200px] items-end bg-[var(--background)]" />
            <div className="sticky left-[250px] flex w-fit bg-[var(--background)]">
              {totalYears.map((date) => (
                <YearItem key={date.getFullYear()} date={date} />
              ))}
            </div>
          </div>

          {/* Calendar body */}
          <DraggableScroll scrollRef={scrollRef}>
            <LoadMore scrollRef={scrollRef} />
            <UngroupedTasks />
            <GroupedTasks />
          </DraggableScroll>
        </div>

        {/* Fake right padding */}
        <div className="sticky right-0 top-[80px] z-20 w-[50px] shrink-0 bg-[var(--background)]"></div>
      </div>
    </div>
  );
}

function Header({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const lock = useTrackStore((s) => s.lock);
  const setLock = useTrackStore((s) => s.setLock);

  useEffect(() => {
    console.log("Controls rendered");
  });

  return (
    <div className="sticky left-0 top-0 z-30 flex h-[80px] items-center justify-between gap-2 bg-[var(--background)] px-[20px]">
      <div className="flex items-center gap-4">
        <CreateDropdown>
          <button className="button-accent-outline">
            <PlusIcon />
            Create
            <TriangleDownIcon />
          </button>
        </CreateDropdown>
        <button className="button-icon-sheer" onClick={() => setLock(!lock)}>
          {lock ? <LockClosedIcon /> : <LockOpen1Icon />}
        </button>
      </div>
      <div className="flex items-center gap-8">
        {/* <div className="flex gap-1">
          <TopButton scrollRef={scrollRef} />
          <BottomButton scrollRef={scrollRef} />
          <LeftButton scrollRef={scrollRef} />
          <RightButton scrollRef={scrollRef} />
        </div> */}
        <Link
          to="element-today"
          options={{ block: "end", behavior: "smooth", inline: "start" }}
          autoScroll={true}
        >
          <button className="button-outline">Today</button>
        </Link>
      </div>
    </div>
  );
}

/* Shadows */
//<div className="shadow-background-top absolute left-0 top-[143px] z-10 h-[10px] w-full"></div>
//<div className="shadow-background-bottom absolute bottom-0 left-0 z-10 h-[10px] w-full"></div>
//<div className="shadow-background-left absolute left-[200px] top-0 z-10 h-full w-[10px]"></div>
//<div className="shadow-background-right absolute right-0 top-0 z-10 h-full w-[10px]"></div>
