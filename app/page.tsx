"use client";

import { useEffect, useState } from "react";
import { AppProvider } from "./AppContext";
import CalendarDay from "./components/CalendarDay/CalendarDay";
import Sidebar from "./components/Sidebar";
import { useTaskStore } from "./stores/TaskStore";
import { useTrackStore } from "./stores/TrackStore";
import { useGroupStore } from "./stores/GroupStore";
import { ToastContainer } from "react-toastify";
import LoadingIcon from "./components/Loading/LoadingIcon";
import EmptyPage from "./EmptyPage";

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

  const suggestCreation = useTaskStore(
    (s) =>
      s.tasksByGroup !== undefined && Object.keys(s.tasksByGroup).length === 0
  );

  useEffect(() => {
    console.log("Page rendered");
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await Promise.all([initGroups(), initTasks(), initTracks()]);
      setIsLoading(false);
    })();
  }, [initGroups, initTasks, initTracks]);

  if (isLoading) {
    return <Loading />;
  }

  return suggestCreation ? (
    <EmptyPage />
  ) : (
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
