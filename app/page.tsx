"use client";

import { AppProvider } from "./AppContext";
import { db } from "./repositories/db";
import Home from "./home/Home";
import { useLiveQuery } from "dexie-react-hooks";
import Loading from "./components/Loading/Loading";
import Product from "./product/page";

export default function Page() {
  return (
    <AppProvider>
      <Content />
    </AppProvider>
  );
}

function Content() {
  // const count = useLiveQuery(() => db.tasks.count(), []);

  // if (count === undefined) {
  //   return <Loading />;
  // }

  // if (count === 0) {
  // return <Product />;
  // }

  return <Home />;
}
