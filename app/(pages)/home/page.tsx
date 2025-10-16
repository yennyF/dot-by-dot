"use client";

import { useEffect } from "react";
import CalendarDay from "./CalendarDay/CalendarDay";
import { PlusIcon, TriangleDownIcon } from "@radix-ui/react-icons";
import AppHeader from "../../components/AppHeader";
import CreateDropdown from "./Header/CreateDropdown";
import LeftButton from "./Header/LeftButton";
import LockButton from "./Header/LockButton";
import Loading from "../../components/Loading/Loading";
import { notifyLoadError } from "../../components/Notification";
import TodayButton from "./Header/TodayButton";
import RightButton from "./Header/RightButton";
import { useAppStore } from "../../stores/appStore";
import {
  AppContentTrigger,
  AppTooltip,
  AppTooltipTrigger,
} from "../../components/AppTooltip";
import { useRouter } from "next/navigation";
import { useTaskLogStore } from "../../stores/taskLogStore";
import { useUserStore } from "../../stores/userStore";
import { CollapseAllButton, ExpandAllButton } from "./Header/CollapseAllButton";

export default function HomePage() {
  const router = useRouter();

  const user = useUserStore((s) => s.user);
  const init = useAppStore((s) => s.init);
  const isEmpty = useAppStore((s) => s.isEmpty);

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      router.replace("/product");
    } else {
      init().catch(() => {
        notifyLoadError();
      });
    }
  }, [user, init, router]);

  useEffect(() => {
    if (isEmpty === undefined) return;
    if (isEmpty === true) {
      router.replace("/start");
    }
  }, [isEmpty, router]);

  return user && isEmpty === false ? <Content /> : <Loading />;
}

function Content() {
  const setLock = useTaskLogStore((s) => s.setLock);

  useEffect(() => {
    setLock(localStorage.getItem("lock") === "true" ? true : false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AppHeader>
        <div className="flex flex-1 items-center justify-between gap-10">
          <div className="flex gap-2">
            <LeftButton />
            <RightButton />
            <TodayButton />
          </div>
          <div className="flex gap-2">
            <ExpandAllButton />
            <CollapseAllButton />
            <LockButton />
            <CreateDropdown>
              <span>
                <AppTooltip>
                  <AppTooltipTrigger asChild>
                    <button className="button-accent button-sm">
                      <PlusIcon />
                      <TriangleDownIcon />
                    </button>
                  </AppTooltipTrigger>
                  <AppContentTrigger>Create new...</AppContentTrigger>
                </AppTooltip>
              </span>
            </CreateDropdown>
          </div>
        </div>
      </AppHeader>
      <main>
        <CalendarDay />
      </main>
    </>
  );
}
