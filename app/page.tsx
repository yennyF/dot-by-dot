"use client";

import { useEffect, useState } from "react";
import { AppProvider } from "./AppContext";
import CalendarDay from "./components/CalendarDay/CalendarDay";
import Sidebar from "./components/Sidebar";
import { useTaskStore } from "./stores/TaskStore";
import { useTrackStore } from "./stores/TrackStore";
import { useGroupStore } from "./stores/GroupStore";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <AppProvider>
      <Content />
    </AppProvider>
  );
}

function Content() {
  const loadTasks = useTaskStore((s) => s.loadTasks);
  const loadGroups = useGroupStore((s) => s.loadGroups);
  const loadTracks = useTrackStore((s) => s.loadTracks);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await Promise.all([loadGroups(), loadTasks(), loadTracks()]);
      setIsLoading(false);
    })();
  }, [loadGroups, loadTasks, loadTracks]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative flex">
      <Sidebar />
      <CalendarDay />
      <ToastContainer autoClose={false} draggable={false} />
    </div>
  );
}

function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-pulse">Loading...</div>
    </div>
  );
}
