"use client";

import { useEffect, useState } from "react";
import CalendarDay from "./CalendarDay/CalendarDay";
import {
  PieChartIcon,
  PlusIcon,
  TriangleDownIcon,
} from "@radix-ui/react-icons";
import AppHeader from "../../components/AppHeader";
import CreateDropdown from "./Header/CreateDropdown";
import LeftButton from "./Header/LeftButton";
import Loading from "../../components/Loading/Loading";
import { notifyLoadError } from "../../components/Notification";
import TodayButton from "./Header/TodayButton";
import RightButton from "./Header/RightButton";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../stores/userStore";
import { CollapseAllButton, ExpandAllButton } from "./Header/CollapseAllButton";
import { supabase } from "@/app/supabase/server";
import AppTooltip from "@/app/components/AppTooltip";
import { useUIStore } from "@/app/stores/useUIStore";
import Sidebar from "@/app/components/Sidebar/Sidebar";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const user = useUserStore((s) => s.user);

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      router.replace("/product");
      return;
    }

    try {
      (async () => {
        const { data, error } = await supabase.rpc("user_has_group_or_task");

        if (error) throw error;
        if (data === false) {
          router.replace("/start");
          return;
        }
      })();

      setLoading(false);
    } catch {
      notifyLoadError();
    }
  }, [user, router]);

  return loading ? <Loading /> : <Content />;
}

function Content() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <>
      <AppHeader>
        <div className="flex flex-1 items-center justify-between gap-10">
          <div className="flex gap-2">
            <LeftButton />
            <RightButton />
            <TodayButton />

            <button
              className="button-outline button-sm"
              onClick={() => {
                toggleSidebar();
              }}
            >
              <PieChartIcon />
              Stats
            </button>
          </div>
          <div className="flex gap-2">
            <ExpandAllButton />
            <CollapseAllButton />
            <CreateDropdown>
              <span>
                <AppTooltip.Root>
                  <AppTooltip.Trigger asChild>
                    <button className="button-accent button-sm">
                      <PlusIcon />
                      <TriangleDownIcon />
                    </button>
                  </AppTooltip.Trigger>
                  <AppTooltip.Content>Create new...</AppTooltip.Content>
                </AppTooltip.Root>
              </span>
            </CreateDropdown>
          </div>
        </div>
      </AppHeader>
      <main className="flex">
        <Sidebar />
        <CalendarDay />
      </main>
    </>
  );
}
