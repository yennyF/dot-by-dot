"use client";

import { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import { AppProvider } from "../AppContext";
import CalendarDay from "./CalendarDay/CalendarDay";
import LoadingIcon from "../components/Loading/LoadingIcon";
import { useGroupStore } from "../stores/GroupStore";
import { useTaskStore } from "../stores/TaskStore";
import { useTrackStore } from "../stores/TrackStore";
import { Link } from "../components/Scroll";
import {
  PlusIcon,
  TriangleDownIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import AppHeader from "../components/AppHeader/AppHeader";
import CreateDropdown from "./CalendarDay/TopHeader/CreateDropdown";
import LeftButton from "./CalendarDay/TopHeader/LeftButton";
import SwitchLock from "./CalendarDay/TopHeader/SwitchLock";

export default function Home() {
  return (
    <AppProvider>
      <Content />
    </AppProvider>
  );
}

function Content() {
  const calendarRef = useRef<HTMLDivElement>(null);

  const initTasks = useTaskStore((s) => s.initTasks);
  const initGroups = useGroupStore((s) => s.initGroups);
  const initTracks = useTrackStore((s) => s.initTracks);

  useEffect(() => {
    console.log("Home rendered");
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await Promise.all([initGroups(), initTasks(), initTracks()]);
      setIsLoading(false);
    })();
  }, [initGroups, initTasks, initTracks]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <AppHeader>
        <div className="flex flex-1 justify-between">
          <div className="flex gap-2">
            <SwitchLock />
            <CreateDropdown>
              <button className="button-accent-outline">
                <PlusIcon />
                Create
                <TriangleDownIcon />
              </button>
            </CreateDropdown>
          </div>

          <div className="">
            <div className="flex items-center gap-2">
              <LeftButton scrollRef={calendarRef} />
              <Link
                to="element-today"
                options={{ block: "end", behavior: "smooth", inline: "start" }}
                autoScroll={true}
              >
                <button className="button-outline">
                  Today
                  <ChevronRightIcon />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </AppHeader>
      <CalendarDay ref={calendarRef} />
      <ToastContainer autoClose={false} draggable={false} />
    </>
  );
}

function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingIcon />
      <div className="animate-pulse">Loading...</div>
    </div>
  );
}
