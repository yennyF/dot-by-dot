"use client";

import { useEffect, useState } from "react";
import { notifyLoadError } from "./components/Notification";
import Home from "./home/Home";
import { useAppStore } from "./stores/AppStore";
import { useGroupStore } from "./stores/GroupStore";
import { useTaskStore } from "./stores/TaskStore";
import Product from "./product/Product";
import Loading from "./components/Loading/Loading";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  const init = useAppStore((s) => s.init);
  const groupSize = useGroupStore((s) => s.size);
  const taskSize = useTaskStore((s) => s.size);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loading />;

  return groupSize > 0 || taskSize > 0 ? <Home /> : <Product />;
}
