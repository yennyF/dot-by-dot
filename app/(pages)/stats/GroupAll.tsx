"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/supabase/server";
import { BarChartData } from "./Charts/Bar";
import { CubeIcon } from "@radix-ui/react-icons";
import { ApiTaskLogDone } from "@/app/types";
import { palette } from "./Charts/colors";
import { ProgressBar } from "./Charts/ProgressBar";
import { Tabs } from "radix-ui";
import { StatTabStatus } from "./utils";

export default function GroupAll({
  setSelectedData,
}: {
  setSelectedData: Dispatch<SetStateAction<BarChartData | undefined>>;
}) {
  const [data, setData] = useState<BarChartData[]>();

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
  }, []);

  if (!data) return null;

  return (
    <>
      <Tabs.Content value={StatTabStatus.howOften}>
        <TabOneContent data={data} setSelectedData={setSelectedData} />
      </Tabs.Content>
      <Tabs.Content value={StatTabStatus.howEven}>
        <TabTwoContent data={data} setSelectedData={setSelectedData} />
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
    <div className="flex flex-1 flex-col gap-[10px]">
      {data.map((item, index) => {
        const portion = (item.value * 100) / 30;
        return (
          <div
            key={index}
            className="flex w-full shrink-0 items-center gap-[10px]"
          >
            <div className="flex-1">
              <div className="flex items-center gap-[10px]">
                <CubeIcon className="text-[var(--gray-9)]" />
                <div>{item.name}</div>
              </div>
              <div
                className="ml-[20px] text-xs text-[var(--inverted)]"
                onClick={() => {
                  setSelectedData(item);
                }}
              >
                See details
              </div>
            </div>

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
  setSelectedData,
}: {
  data: BarChartData[];
  setSelectedData: (value: SetStateAction<BarChartData | undefined>) => void;
}) {
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
          <div className="flex-1">
            <div className="flex items-center gap-[10px]">
              <CubeIcon className="text-[var(--gray-9)]" />
              <div>{item.name}</div>
            </div>
            <div
              className="ml-[20px] text-xs text-[var(--inverted)]"
              onClick={() => {
                setSelectedData(item);
              }}
            >
              See details
            </div>
          </div>

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
