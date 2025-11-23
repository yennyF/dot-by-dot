import React, { useEffect, useState } from "react";
import { HomePageContext } from "../HomePageContext";
import { notifyLoadError } from "@/app/components/Notification";
import { supabase } from "@/app/supabase/server";
import { ApiTaskLogDone } from "@/app/types";
import { BarChartData } from "../Charts/Bar";
import TabsStats, { StatTabStatus } from "./TabsStats";

export default function Sidebar() {
  const { selectedGroup } = React.use(HomePageContext);

  return (
    <div className="sticky top-[0px] h-[100vh] w-[450px] shrink-0 border-r-2 border-solid border-[var(--gray-5)] px-[50px] pt-[100px]">
      {selectedGroup ? (
        <GroupDetail groupId={selectedGroup.id} />
      ) : (
        <GroupAll />
      )}
    </div>
  );
}

function GroupAll() {
  const [activeTab, setActiveStatTab] = useState<StatTabStatus>(
    StatTabStatus.howOften
  );
  const [dataGroups, setDataGroups] = useState<BarChartData[]>();
  const [dataTasks, setDataTasks] = useState<BarChartData[]>();
  const [daysDone, setDaysDone] = useState<number>();

  useEffect(() => {
    try {
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
        }));
        setDataGroups(dataMaped);
      })();

      (async () => {
        const { data, error } = await supabase.rpc("task_days_done_last_30", {
          p_group_id: null,
        });

        if (error) throw error;

        const dataMaped = (data as ApiTaskLogDone[]).map((item) => ({
          id: item.id,
          name: item.name,
          value: item.days_done,
        }));
        setDataTasks(dataMaped);
      })();

      (async () => {
        const { data, error } = await supabase.rpc("group_days_last_30");

        if (error) throw error;

        setDaysDone(data[0]["days_done"]);
      })();
    } catch {
      notifyLoadError();
    }
  }, []);

  if (!dataGroups || !dataTasks || daysDone === undefined) {
    return null;
  }

  return (
    <TabsStats
      value={activeTab}
      onValueChange={(value) => setActiveStatTab(value as StatTabStatus)}
      dataGroups={dataGroups}
      dataTasks={dataTasks}
      daysDone={daysDone}
    />
  );
}

function GroupDetail({ groupId }: { groupId: string }) {
  const [activeTab, setActiveStatTab] = useState<StatTabStatus>(
    StatTabStatus.howOften
  );
  const [dataTasks, setDataGroups] = useState<BarChartData[]>();
  const [daysDone, setDaysDone] = useState<number>();

  useEffect(() => {
    try {
      (async () => {
        const { data, error } = await supabase.rpc("task_days_done_last_30", {
          p_group_id: groupId,
        });

        if (error) throw error;

        const dataMaped = (data as ApiTaskLogDone[]).map((item) => ({
          id: item.id,
          name: item.name,
          value: item.days_done,
        }));
        setDataGroups(dataMaped);
      })();

      (async () => {
        const { data, error } = await supabase.rpc("task_days_last_30", {
          p_group_id: groupId,
        });

        if (error) throw error;

        setDaysDone(data[0]["days_done"]);
      })();
    } catch {
      notifyLoadError();
    }
  }, [groupId]);

  if (!dataTasks || daysDone === undefined) {
    return null;
  }

  return (
    <TabsStats
      value={activeTab}
      onValueChange={(value) => setActiveStatTab(value as StatTabStatus)}
      dataGroups={[]}
      dataTasks={dataTasks}
      daysDone={daysDone}
    />
  );
}
