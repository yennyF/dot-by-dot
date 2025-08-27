"use client";

import { useEffect, useState } from "react";
import CalendarDay from "./CalendarDay/CalendarDay";
import { PlusIcon, TriangleDownIcon } from "@radix-ui/react-icons";
import AppHeader from "../components/AppHeader";
import CreateDropdown from "./Header/CreateDropdown";
import LeftButton from "./Header/LeftButton";
import LockButton from "./Header/LockButton";
import Loading from "../components/Loading/Loading";
import { notifyLoadError } from "../components/Notification";
import TodayButton from "./Header/TodayButton";
import RightButton from "./Header/RightButton";
import { useAppStore } from "../stores/AppStore";
import { AppContent, AppTooltip, AppTrigger } from "../components/AppTooltip";
import { useRouter } from "next/navigation";
import SettingsButton from "./Header/SettingsButton";

export default function HomePage() {
  const router = useRouter();

  const isDataEmpty = useAppStore((s) => s.isDataEmpty);

  useEffect(() => {
    if (isDataEmpty === true) {
      router.replace("/product");
    }
  }, [isDataEmpty, router]);

  return isDataEmpty === false ? <Content /> : <Loading />;
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
        <div className="flex flex-1 items-center justify-end gap-10">
          <div className="flex gap-2">
            <LeftButton />
            <RightButton />
            <TodayButton />
          </div>
          <div className="flex gap-2">
            <SettingsButton />
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
      <main className="pt-[10px]">
        {isLoading ? <Loading /> : <CalendarDay />}
      </main>
    </>
  );
}
