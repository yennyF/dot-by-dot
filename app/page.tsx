"use client";

import { useEffect } from "react";
import { AppProvider } from "./AppContext";
import { getDatabase } from "./repositories/db";
import Home from "./home/Home";
import { useLiveQuery } from "dexie-react-hooks";
import Loading from "./components/Loading/Loading";
import Start from "./start/page";
import { useAppStore } from "./stores/AppStore";

export default function Page() {
  return (
    <AppProvider>
      <Content />
    </AppProvider>
  );
}

function Content() {
  const testMode = useAppStore((s) => s.testMode);

  const count = useLiveQuery(() => {
    const db = getDatabase();
    return db.tasks.count();
  }, [testMode]);

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
