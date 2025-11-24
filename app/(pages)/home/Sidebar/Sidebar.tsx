import React, { useEffect, useState } from "react";
import { notifyLoadError } from "@/app/components/Notification";
import { supabase } from "@/app/supabase/server";
import { ApiTaskLogDone } from "@/app/types";
import { BarChartData } from "./Charts/Bar";
import TabsStats, { StatTabStatus } from "./TabsStats";
import { AnimatePresence, motion } from "motion/react";
import { useUIStore } from "@/app/stores/useUIStore";

export default function Sidebar() {
  const selectedGroup = useUIStore((s) => s.selectedGroup);
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);

  return (
    <motion.div
      animate={{ width: isSidebarOpen ? "fit-content" : 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="sticky top-0 h-screen w-[420px] shrink-0 overflow-scroll border-r-2 border-solid border-[var(--gray-5)] px-[40px] pt-[100px]"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
          >
            {/* <div className="mb-[50px] flex w-full items-center justify-center">
              <CalendarMonth />
            </div> */}
            {selectedGroup ? (
              <GroupDetail groupId={selectedGroup.id} />
            ) : (
              <GroupAll />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
