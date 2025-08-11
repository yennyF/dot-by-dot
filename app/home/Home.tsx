"use client";

import { useEffect, useRef, useState } from "react";
import { AppProvider } from "../AppContext";
import CalendarDay from "./CalendarDay/CalendarDay";
import { useTrackStore } from "../stores/TrackStore";
import { Link } from "../components/Scroll";
import {
  PlusIcon,
  TriangleDownIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import AppHeader from "../components/AppHeader/AppHeader";
import CreateDropdown from "./TopHeader/CreateDropdown";
import LeftButton from "./TopHeader/LeftButton";
import LockButton from "./TopHeader/LockButton";
import Loading from "../components/Loading/Loading";
import AppTooltip from "../components/AppTooltip";
import { notifyLoadError } from "../components/Notification";

export default function Home() {
  return (
    <AppProvider>
      <Content />
    </AppProvider>
  );
}

function Content() {
  const calendarRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);

  const init = useTrackStore((s) => s.init);

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
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <AppHeader>
        <div className="flex flex-1 justify-between">
          <div className="flex items-center gap-2">
            <LockButton />

            <CreateDropdown>
              <span>
                <AppTooltip content="New" contentClassName="z-40" asChild>
                  <button className="button-accent button-sm">
                    <PlusIcon />
                    <TriangleDownIcon />
                  </button>
                </AppTooltip>
              </span>
            </CreateDropdown>
          </div>

          <div className="">
            <div className="flex items-center gap-2">
              <LeftButton scrollRef={calendarRef} />
              <Link
                to="element-today"
                options={{ block: "end", behavior: "smooth", inline: "start" }}
                autoScroll={true}
              >
                <AppTooltip
                  content="Go to recent"
                  contentClassName="z-40"
                  asChild
                >
                  <button className="button-outline button-sm">
                    Today
                    <ChevronRightIcon />
                  </button>
                </AppTooltip>
              </Link>
            </div>
          </div>
        </div>
      </AppHeader>
      <CalendarDay ref={calendarRef} />
    </>
  );
}
