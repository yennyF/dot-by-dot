"use client";

import React, { useEffect, useState } from "react";
import { notifyLoadError } from "@/app/components/Notification";
import { supabase } from "@/app/supabase/server";
import { ApiTaskLogDone } from "@/app/types";
import { Tabs } from "radix-ui";
import { BarChartData } from "../../../components/Charts/Bar";
import TabContentEven from "./TabContentEven";
import TabContentOften from "./TabContentOften";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { useGroupStore } from "@/app/stores/groupStore";
import { ViewStatsContext } from "./ViewStatsContext";

type TabType = "often" | "even";

interface BarChartDataExtend extends BarChartData {
  groupId: string | null;
  taskId?: string;
}

export default function ViewStats() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [activeTab, setActiveStatTab] = useState<TabType>("often");
  const [dataGroups, setDataGroups] = useState<BarChartDataExtend[]>();
  const [dataTasks, setDataTasks] = useState<BarChartDataExtend[]>();
  const [daysDone, setDaysDone] = useState<number>();

  useEffect(() => {
    if (selectedGroup === null) {
      try {
        (async () => {
          const { data, error } = await supabase.rpc("task_days_done_last_30", {
            p_group_id: null,
          });
          if (error) throw error;

          const dataMaped = (data as ApiTaskLogDone[]).map((item) => ({
            id: item.id,
            name: item.name,
            value: item.days_done,
            taskId: item.id,
            groupId: null,
          }));
          setDataTasks(dataMaped);
        })();

        (async () => {
          // supabase.functions
          //   .invoke("hello-world", { body: { name: "React" } })
          //   .then((response) => {
          //     console.log(response);
          //   })
          //   .catch((error) => {
          //     console.log(error);
          //   });
          const { data, error } = await supabase.rpc("group_days_done_last_30");
          if (error) throw error;

          const dataMaped = (data as ApiTaskLogDone[]).map((item) => ({
            id: item.id,
            name: item.name,
            value: item.days_done,
            groupId: item.id,
          }));
          setDataGroups(dataMaped);
        })();

        (async () => {
          const { data, error } = await supabase.rpc("group_days_last_30");
          if (error) throw error;
          setDaysDone(data[0]["days_done"]);
        })();
      } catch {
        notifyLoadError();
      }
    } else {
      try {
        (async () => {
          const { data, error } = await supabase.rpc("task_days_done_last_30", {
            p_group_id: selectedGroup,
          });
          if (error) throw error;

          const dataMaped = (data as ApiTaskLogDone[]).map((item) => ({
            id: item.id,
            name: item.name,
            value: item.days_done,
            taskId: item.id,
            groupId: selectedGroup,
          }));
          setDataTasks(dataMaped);
          setDataGroups([]);
        })();

        (async () => {
          const { data, error } = await supabase.rpc("task_days_last_30", {
            p_group_id: selectedGroup,
          });
          if (error) throw error;
          setDaysDone(data[0]["days_done"]);
        })();
      } catch {
        notifyLoadError();
      }
    }
  }, [selectedGroup]);

  if (!dataGroups || !dataTasks || daysDone === undefined) {
    return null;
  }

  return (
    <div className="mx-auto my-[100px] px-[50px]">
      {/* <div className="mx-[200px]">
        <CalendarMonth />
      </div> */}
      <ViewStatsContext.Provider value={{ selectedGroup, setSelectedGroup }}>
        <BreadcrumbsWrapper />
        <Tabs.Root
          className="w-[400px] shrink-0"
          value={activeTab}
          onValueChange={(value) => setActiveStatTab(value as TabType)}
        >
          <Tabs.List
            className="flex gap-[10px]"
            aria-label="Manage your account"
          >
            <Tabs.Trigger value={"often"} className="button-tab button-sm">
              How often
            </Tabs.Trigger>
            <Tabs.Trigger value={"even"} className="button-tab button-sm">
              How even
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value={"often"}>
            <TabContentOften
              data={[...dataTasks, ...dataGroups]}
              daysDone={daysDone}
            />
          </Tabs.Content>
          <Tabs.Content value={"even"}>
            <TabContentEven
              data={[...dataTasks, ...dataGroups]}
              daysDone={daysDone}
            />
          </Tabs.Content>
        </Tabs.Root>
      </ViewStatsContext.Provider>
    </div>
  );
}

function BreadcrumbsWrapper() {
  const { selectedGroup, setSelectedGroup } = React.use(ViewStatsContext);

  const group = useGroupStore((s) =>
    s.groups.find((g) => g.id === selectedGroup)
  );

  return (
    <div className="mb-[50px]">
      <Breadcrumbs.Root value={selectedGroup ?? "-1"}>
        <Breadcrumbs.Item value={"-1"} onClick={() => setSelectedGroup(null)}>
          All
        </Breadcrumbs.Item>
        {group && (
          <Breadcrumbs.Item value={group.id}>{group.name}</Breadcrumbs.Item>
        )}
      </Breadcrumbs.Root>
    </div>
  );
}
