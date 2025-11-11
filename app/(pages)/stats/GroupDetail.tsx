"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/supabase/server";
import { BarChartData } from "./Charts/Bar";
import { ApiTaskLogDone } from "@/app/types";
import { palette } from "./Charts/colors";
import { ProgressBar } from "./Charts/ProgressBar";
import { Tabs } from "radix-ui";

export default function GroupDetail({ groupId }: { groupId: string }) {
  const [data, setData] = useState<BarChartData[]>();

  useEffect(() => {
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
      setData(dataMaped);
    })();
  }, [groupId]);

  if (!data) {
    return null;
  }

  return (
    <Tabs.Root defaultValue="tab1">
      <Tabs.List
        className="mb-[50px] flex gap-[50px]"
        aria-label="Manage your account"
      >
        <Tabs.Trigger value="tab1">Days</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Contrast</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        {data && <TabOneContent data={data} />}
      </Tabs.Content>
      <Tabs.Content value="tab2">
        {data && <TabTwoContent data={data} />}
      </Tabs.Content>
    </Tabs.Root>
  );
}

function TabOneContent({ data }: { data: BarChartData[] }) {
  return (
    <div className="flex flex-1 flex-col gap-[10px]">
      {data.map((item) => {
        const portion = Math.round((item.value * 100) / 30);
        return (
          <div
            key={item.id}
            className="flex w-full shrink-0 items-center gap-[10px]"
          >
            <div className="flex-1">{item.name}</div>

            <div className="relative flex flex-col justify-center gap-[5px]">
              <div
                className="absolute flex w-fit flex-col gap-[2px] text-nowrap pl-[10px] text-xs"
                style={{ left: portion + "%" }}
              >
                {item.value > 0 && (
                  <div>
                    <span>{item.value} </span>
                    <span className="text-[var(--gray-9)]">
                      {item.value > 1 ? "days" : "day"}
                    </span>
                  </div>
                )}
              </div>
              <ProgressBar value={portion} size={550} thickness={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TabTwoContent({ data }: { data: BarChartData[] }) {
  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  const portions = useMemo(
    () => data.map((item) => Math.round((item.value * 100) / total)),
    [data, total]
  );

  const starts = useMemo(() => {
    const starts: number[] = [];
    portions.reduce((sum, p) => {
      starts.push(sum);
      return sum + p;
    }, 0);
    return starts;
  }, [portions]);

  return (
    <div className="flex flex-1 flex-col gap-[10px]">
      {data.map((item, index) => (
        <div
          key={item.id}
          className="flex w-full shrink-0 items-center gap-[10px]"
        >
          <div className="flex-1">{item.name}</div>

          <div className="relative flex flex-col justify-center gap-[5px]">
            <div
              className="absolute flex w-fit flex-col gap-[2px] text-nowrap pl-[10px] text-xs"
              style={{
                left: starts[index] + portions[index] + "%",
              }}
            >
              {item.value > 0 && (
                <div>
                  <span>{portions[index]}</span>
                  <span className="text-[var(--gray-9)]">% </span>
                </div>
              )}
            </div>
            <ProgressBar
              value={portions[index]}
              size={550}
              thickness={20}
              color={palette.one[index]}
              start={starts[index]}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
