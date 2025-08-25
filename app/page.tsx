"use client";

import { useEffect, useState } from "react";
import { notifyLoadError } from "./components/Notification";
import Home from "./home/Home";
import { useAppStore } from "./stores/AppStore";
import Product from "./product/Product";
import Loading from "./components/Loading/Loading";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  const isDataEmpty = useAppStore((s) => s.isDataEmpty);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        await init();
      } catch {
        notifyLoadError();
      }
      setIsLoading(false);
    })();
  }, []);

  if (isLoading || isDataEmpty === undefined) return <Loading />;

  return isDataEmpty ? <Product /> : <Home />;
}
