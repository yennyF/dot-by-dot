"use client";

import { useEffect } from "react";
import { AppProvider } from "./AppContext";
import LoadingIcon from "./components/Loading/LoadingIcon";
import Start from "./home/Start";
import { db } from "./repositories/db";
import Home from "./home/Home";
import { useLiveQuery } from "dexie-react-hooks";

export default function Page() {
  return (
    <AppProvider>
      <Content />
    </AppProvider>
  );
}

function Content() {
  const count = useLiveQuery(() => db.tasks.count(), []);

  useEffect(() => {
    console.log("Page rendered");
  });

  if (count === undefined) {
    return <Loading />;
  }

  if (count === 0) {
    return <Start />;
  }

  return <Home />;
}

function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingIcon />
      <div className="animate-pulse">Loading...</div>
    </div>
  );
}
