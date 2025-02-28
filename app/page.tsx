"use client";

import CalendarList from "./components/CalendarList";
import { AppContext, AppProvider } from "./AppContext";
import CalendarGrid from "./components/CalendarGrid";
import { use } from "react";
import Navbar from "./components/Navbar";

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
  const { page } = appContext;

  // return page === "grid" ? <CalendarGrid /> : <CalendarList />;
  return <CalendarList />;
}
