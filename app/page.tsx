"use client";

import { AppContext, AppProvider } from "./AppContext";
import { use } from "react";
import CalendarDay from "./components/CalendarDay/CalendarDay";
import Sidebar from "./components/Sidebar";

export default function Home() {
  return (
    <AppProvider>
      <Content />
    </AppProvider>
  );
}

function Content() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("Home must be used within a AppProvider");
  }
  const { tasks } = appContext;

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
