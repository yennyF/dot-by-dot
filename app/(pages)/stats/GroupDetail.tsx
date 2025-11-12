"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/supabase/server";
import { BarChartData } from "./Charts/Bar";
import { ApiTaskLogDone } from "@/app/types";
import { palette } from "./Charts/colors";
import { ProgressBar } from "./Charts/ProgressBar";
import { Tabs } from "radix-ui";
import { StatTabStatus } from "./utils";

export default function GroupDetail({
  groupId,
  activeTab,
}: {
  groupId: string;
  activeTab: StatTabStatus;
}) {
  const [data, setData] = useState<BarChartData[]>();
  const [daysDone, setDaysDone] = useState<number>();
  const [daysEmpty, setDaysEmpty] = useState<number>();

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

    (async () => {
      const { data, error } = await supabase.rpc("task_days_last_30", {
        p_group_id: groupId,
      });

      if (error) throw error;

      setDaysDone(data[0]["days_done"]);
      setDaysEmpty(data[0]["empty_days"]);
    })();
  }, [groupId]);

  if (!data || daysDone === undefined || daysEmpty === undefined) {
    return null;
  }

  const daysDonePer = Math.round((daysDone * 100) / 30);
  const daysEmptyPer = Math.round((daysEmpty * 100) / 30);

  return (
    <>
      <div className="mb-[20px] flex justify-end gap-[40px]">
        <div>
          <span className="text-[var(--gray-9)]">Progress days: </span>
          <span>
            {activeTab === StatTabStatus.howOften
              ? daysDone
              : daysDonePer + "%"}
          </span>
        </div>
        <div>
          <span className="text-[var(--gray-9)]">Rest days: </span>
          <span>
            {activeTab === StatTabStatus.howOften
              ? daysEmpty
              : daysEmptyPer + "%"}
          </span>
        </div>
      </div>

      <Tabs.Content value={StatTabStatus.howOften}>
        {data && <TabOneContent data={data} />}
      </Tabs.Content>
      <Tabs.Content value={StatTabStatus.howEven}>
        {data && daysEmpty && (
          <TabTwoContent data={data} daysDonePer={daysDonePer} />
        )}
      </Tabs.Content>
    </>
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

function TabTwoContent({
  data,
  daysDonePer,
}: {
  data: BarChartData[];
  daysDonePer: number;
}) {
  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  const portions = useMemo(
    () => data.map((item) => Math.round((item.value * daysDonePer) / total)),
    [data, total, daysDonePer]
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
