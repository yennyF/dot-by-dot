"use client";

import { useEffect } from "react";
import { AppProvider } from "./AppContext";
import CalendarDay from "./components/CalendarDay/CalendarDay";
import Sidebar from "./components/Sidebar";
import { useTaskStore } from "./stores/TaskStore";
import { useTrackStore } from "./stores/TrackStore";

export default function Home() {
  return (
    <AppProvider>
      <Content />
    </AppProvider>
  );
}

function Content() {
  const loadTask = useTaskStore((s) => s.loadTasks);
  const tasks = useTaskStore((s) => s.tasks);

  const loadTracks = useTrackStore((s) => s.loadTracks);

  useEffect(() => {
    loadTask();
    loadTracks();
  }, [loadTask, loadTracks]);

  if (!tasks) {
    return <Loading />;
  }

  return (
    <div className="relative flex">
      <Sidebar />
      <CalendarDay />
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
