"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/supabase/server";
import { BarChartData } from "./Charts/Bar";
import { CubeIcon } from "@radix-ui/react-icons";
import { ApiTaskLogDone } from "@/app/types";
import { palette } from "./Charts/colors";
import {
  ProgressBar,
  ProgressBarLabelDay,
  ProgressBarLabelPer,
} from "./Charts/ProgressBar";
import { Tabs } from "radix-ui";
import { StatTabStatus } from "./utils";

export default function GroupAll({
  setSelectedData,
  activeTab,
}: {
  setSelectedData: Dispatch<SetStateAction<BarChartData | undefined>>;
  activeTab: StatTabStatus;
}) {
  const [data, setData] = useState<BarChartData[]>();
  const [daysDone, setDaysDone] = useState<number>();
  const [daysEmpty, setDaysEmpty] = useState<number>();

  useEffect(() => {
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
      setData(dataMaped);
    })();

    (async () => {
      const { data, error } = await supabase.rpc("group_days_last_30");

      if (error) throw error;

      setDaysDone(data[0]["days_done"]);
      setDaysEmpty(data[0]["empty_days"]);
    })();
  }, []);

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
        <TabOneContent data={data} setSelectedData={setSelectedData} />
      </Tabs.Content>
      <Tabs.Content value={StatTabStatus.howEven}>
        <TabTwoContent
          data={data}
          setSelectedData={setSelectedData}
          daysDonePer={daysDonePer}
        />
      </Tabs.Content>
    </>
  );
}

function TabOneContent({
  data,
  setSelectedData,
}: {
  data: BarChartData[];
  setSelectedData: (value: SetStateAction<BarChartData | undefined>) => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-[5px]">
      {data.map((item, index) => {
        const portion = Math.round((item.value * 100) / 30);
        return (
          <div key={index} className="flex">
            <Label item={item} setSelectedData={setSelectedData} />
            <div className="flex-1">
              <ProgressBar value={portion} size={"100%"} thickness={20}>
                <ProgressBarLabelDay value={item.value} />
              </ProgressBar>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TabTwoContent({
  data,
  setSelectedData,
  daysDonePer,
}: {
  data: BarChartData[];
  setSelectedData: (value: SetStateAction<BarChartData | undefined>) => void;
  daysDonePer: number;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const portions = data.map((item) =>
    Math.round((item.value * daysDonePer) / total)
  );

  let acc = 0;
  const starts = portions.map((p) => {
    const current = acc;
    acc += p;
    return current;
  });

  return (
    <div className="flex flex-1 flex-col gap-[5px]">
      {data.map((item, index) => (
        <div key={item.id} className="flex">
          <Label item={item} setSelectedData={setSelectedData} />
          <div className="flex-1">
            <ProgressBar
              value={portions[index]}
              size={"100%"}
              thickness={20}
              color={palette.one[index]}
              start={starts[index]}
            >
              <ProgressBarLabelPer value={item.value} />
            </ProgressBar>
          </div>
        </div>
      ))}
    </div>
  );
}

function Label({
  item,
  setSelectedData,
}: {
  item: BarChartData;
  setSelectedData: Dispatch<SetStateAction<BarChartData | undefined>>;
}) {
  return (
    <div>
      <div className="flex h-[20px] w-[250px] items-center gap-[10px]">
        <CubeIcon className="text-[var(--gray-9)]" />
        <span className="overflow-hidden text-ellipsis text-nowrap">
          {item.name}
        </span>
      </div>
      <button
        className="ml-[25px] text-xs text-[var(--inverted)]"
        onClick={() => {
          setSelectedData(item);
        }}
      >
        See details
      </button>
    </div>
  );
}
