"use client";

import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { AppProvider } from "../AppContext";
import CalendarDay from "./CalendarDay/CalendarDay";
import LoadingIcon from "./Loading/LoadingIcon";
import { useGroupStore } from "../stores/GroupStore";
import { useTaskStore } from "../stores/TaskStore";
import { useTrackStore } from "../stores/TrackStore";

export default function Home() {
  return (
    <AppProvider>
      <Content />
    </AppProvider>
  );
}

function Content() {
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
    <div className="relative flex">
      <CalendarDay />
      {/* <Sidebar /> */}
      <ToastContainer autoClose={false} draggable={false} />
    </div>
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
