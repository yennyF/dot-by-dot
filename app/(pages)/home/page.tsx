"use client";

import { useEffect, useState } from "react";
import LogHorizontal from "./LogHorizontal/LogHorizontal";
import {
  GridIcon,
  LayoutIcon,
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
import Sidebar from "@/app/(pages)/home/Sidebar/Sidebar";
import LogGrid from "./LogGrid/LogGrid";
import { useTaskStore } from "@/app/stores/taskStore";
import { useGroupStore } from "@/app/stores/groupStore";
import { useTaskLogStore } from "@/app/stores/taskLogStore";

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
  const dotLayout = useUIStore((s) => s.dotLayout);
  const setDotLayout = useUIStore((s) => s.setDotLayout);

  const fetchGroups = useGroupStore((s) => s.fetchGroups);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const fetchTaskLogs = useTaskLogStore((s) => s.fetchTaskLogs);
  const totalDate = useTaskLogStore((s) => s.totalDate);

  useEffect(() => {
    try {
      Promise.all([fetchGroups(), fetchTasks()]);
    } catch {
      notifyLoadError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      fetchTaskLogs();
    } catch {
      notifyLoadError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalDate]);

  return (
    <>
      <AppHeader>
        <div className="flex flex-1 items-center justify-between gap-10">
          <div className="flex gap-2">
            <button
              className="button-outline button-sm"
              onClick={() => {
                toggleSidebar();
              }}
            >
              <PieChartIcon />
              Stats
            </button>
            <button
              data-state={dotLayout === "grid" ? "active" : undefined}
              className="button-outline button-sm"
              onClick={() => {
                setDotLayout("grid");
              }}
            >
              <GridIcon />
            </button>
            <button
              data-state={dotLayout === "horizontal" ? "active" : undefined}
              className="button-outline button-sm"
              onClick={() => {
                setDotLayout("horizontal");
              }}
            >
              <LayoutIcon />
            </button>
          </div>
          <div className="flex gap-2">
            {dotLayout === "horizontal" && (
              <>
                <LeftButton />
                <RightButton />
                <TodayButton />
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
              </>
            )}
          </div>
        </div>
      </AppHeader>
      <main className="flex">
        <Sidebar />
        {dotLayout === "grid" ? <LogGrid /> : <LogHorizontal />}
      </main>
    </>
  );
}
