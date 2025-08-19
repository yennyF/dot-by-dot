"use client";

import { useEffect, useState } from "react";
import { AppProvider } from "../AppContext";
import CalendarDay from "./CalendarDay/CalendarDay";
import { PlusIcon, TriangleDownIcon } from "@radix-ui/react-icons";
import AppHeader from "../components/AppHeader/AppHeader";
import CreateDropdown from "./Header/CreateDropdown";
import LeftButton from "./Header/LeftButton";
import LockButton from "./Header/LockButton";
import Loading from "../components/Loading/Loading";
import { notifyLoadError } from "../components/Notification";
import TodayButton from "./Header/TodayButton";
import RightButton from "./Header/RightButton";
import { useAppStore } from "../stores/AppStore";
import { AppContent, AppTooltip, AppTrigger } from "../components/AppTooltip";

export default function Home() {
  return (
    <AppProvider>
      <Content />
    </AppProvider>
  );
}

function Content() {
  const [isLoading, setIsLoading] = useState(true);

  const init = useAppStore((s) => s.init);

  useEffect(() => {
    console.log("Home rendered");
  });

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

  return (
    <>
      <AppHeader>
        <div className="flex flex-1 justify-between">
          <div className="flex items-center gap-2">
            <TodayButton />
            <LeftButton />
            <RightButton />
          </div>
          <div className="flex items-center gap-2">
            <LockButton />
            <CreateDropdown>
              <span>
                <AppTooltip>
                  <AppTrigger asChild>
                    <button className="button-accent button-sm">
                      <PlusIcon />
                      <TriangleDownIcon />
                    </button>
                  </AppTrigger>
                  <AppContent>New</AppContent>
                </AppTooltip>
              </span>
            </CreateDropdown>
          </div>
        </div>
      </AppHeader>
      {isLoading ? <Loading /> : <CalendarDay />}
    </>
  );
}
