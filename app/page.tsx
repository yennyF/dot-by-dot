"use client";

import { AppContext, AppProvider } from "./AppContext";
import { use } from "react";
import Navbar from "./components/Navbar";
import CalendarDay from "./components/CalendarDay/CalendarDay";

export default function Home() {
  return (
    <AppProvider>
      <Navbar />
      <Content />
    </AppProvider>
  );
}

function Content() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("Home must be used within a AppProvider");
  }
  const { habits } = appContext;

  if (!habits) {
    return <Loading />;
  }

  return <CalendarDay />;
}

function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-pulse">Loading...</div>
    </div>
  );
}
