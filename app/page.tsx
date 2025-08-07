"use client";

import { useEffect } from "react";
import { AppProvider } from "./AppContext";
import { db } from "./repositories/db";
import Home from "./home/Home";
import { useLiveQuery } from "dexie-react-hooks";
import Loading from "./components/Loading/Loading";
import Start from "./start/page";

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
