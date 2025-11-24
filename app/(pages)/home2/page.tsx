"use client";

import React, { use, useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";

import Loading from "../../components/Loading/Loading";
import { notifyLoadError } from "../../components/Notification";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../stores/userStore";
import { supabase } from "@/app/supabase/server";
import { useGroupStore } from "@/app/stores/groupStore";
import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/taskStore";
import { Group, Task } from "@/app/types";
import { CubeIcon, PieChartIcon } from "@radix-ui/react-icons";
import Breadcrumbs, { BreadcrumbsItem } from "@/app/components/Breadcrumbs";
import TaskGrid from "./TaskGrid";
import GroupGrid from "./GroupGrid";
import { HomePageContext } from "./HomePageContext";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useUIStore } from "@/app/stores/useUIStore";

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

  const fetchGroups = useGroupStore((s) => s.fetchGroups);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const fetchTaskLogs = useTaskLogStore((s) => s.fetchTaskLogs);
  const totalDate = useTaskLogStore((s) => s.totalDate);

  const [selectedGroup, setSelectedGroup] = useState<Group>();

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
        <div className="flex flex-1 items-center gap-10">
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
      </AppHeader>
      <HomePageContext value={{ selectedGroup, setSelectedGroup }}>
        <main className="flex">
          <Sidebar />
          <div className="my-[100px] flex-1 px-[50px]">
            <div className="my-[20px]">
              <Breadcrumbs value={selectedGroup?.id ?? "-1"}>
                <BreadcrumbsItem
                  value={"-1"}
                  onClick={() => setSelectedGroup(undefined)}
                >
                  All groups
                </BreadcrumbsItem>
                {selectedGroup && (
                  <BreadcrumbsItem
                    value={selectedGroup.id}
                    className="flex items-center gap-[10px]"
                  >
                    <CubeIcon className="size-[20px]" />
                    <span>{selectedGroup.name}</span>
                  </BreadcrumbsItem>
                )}
              </Breadcrumbs>
            </div>

            {selectedGroup ? (
              <GroupDetail groupId={selectedGroup.id} />
            ) : (
              <GroupAll />
            )}
          </div>
        </main>
      </HomePageContext>
    </>
  );
}

function GroupAll() {
  const tasks = useTaskStore((s) => s.tasksByGroup[UNGROUPED_KEY]) || [];
  const groups = useGroupStore((s) => s.groups);

  return <Grid tasks={tasks} groups={groups} />;
}

function GroupDetail({ groupId }: { groupId: string }) {
  const tasks =
    useTaskStore((s) => s.tasksByGroup[groupId ?? UNGROUPED_KEY]) || [];

  return <Grid tasks={tasks} groups={[]} />;
}

function Grid({ tasks, groups }: { tasks: Task[]; groups: Group[] }) {
  const { setSelectedGroup } = use(HomePageContext);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[40px]">
      {tasks.map((task) => (
        <div key={task.id} className="flex flex-col items-center gap-[15px]">
          <TaskLabel>{task.name}</TaskLabel>
          <TaskGrid taskId={task.id} />
        </div>
      ))}
      {groups.map((group) => (
        <div key={group.id} className="flex flex-col gap-[15px]">
          <GroupLabel
            onClick={() => {
              setSelectedGroup(group);
            }}
          >
            {group.name}
          </GroupLabel>
          <GroupGrid groupId={group.id} />
        </div>
      ))}
    </div>
  );
}

function GroupLabel({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      className="flex items-center justify-center gap-[10px]"
      onClick={onClick}
    >
      <CubeIcon className="text-[var(--gray-9)]" />
      <TaskLabel>{children}</TaskLabel>
    </button>
  );
}

function TaskLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="overflow-hidden text-ellipsis text-nowrap">
      {children}
    </span>
  );
}
