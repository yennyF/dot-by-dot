"use client";

import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import Loading from "../../components/Loading/Loading";
import { notifyLoadError } from "../../components/Notification";
import { useAppStore } from "../../stores/appStore";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../stores/userStore";
import GoBackButton from "@/app/components/GoBackButton";
import { supabase } from "@/app/supabase/server";
import { BarChart, BarChartData } from "./Charts/Bar";
import { CubeIcon } from "@radix-ui/react-icons";
import { ApiTaskLogDone } from "@/app/types";
import { Accordion } from "radix-ui";
import { palette } from "./Charts/colors";

export default function StatsPage() {
  const router = useRouter();

  const user = useUserStore((s) => s.user);
  const init = useAppStore((s) => s.init);
  const isEmpty = useAppStore((s) => s.isEmpty);

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      router.replace("/product");
    } else {
      init().catch(() => {
        notifyLoadError();
      });
    }
  }, [user, init, router]);

  useEffect(() => {
    if (isEmpty === undefined) return;
    if (isEmpty === true) {
      router.replace("/start");
    }
  }, [isEmpty, router]);

  return user && isEmpty === false ? <Content /> : <Loading />;
}

function Content() {
  const [data, setData] = useState<BarChartData[]>();
  const [total, setTotal] = useState<number>();
  const [percentages, setPercentages] = useState<number[]>();

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

  if (!data) {
    return <Loading />;
  }

  return (
    <>
      <AppHeader></AppHeader>
      <main className="page-main flex flex-col">
        <GoBackButton />

        <h1 className="page-title-1 mt-[20px]">Stats</h1>

        <span className="mt-[10px]">Last 30 days</span>

        <div className="mb-[20px] mt-[20px] flex items-center gap-[10px]">
          <CubeIcon className="size-[20px]" />
          <h2 className="flex-1 text-xl font-bold">All Groups</h2>
        </div>

        <BarChart
          data={data}
          height="20px"
          colors={palette.one}
          onLoad={(total, percentages) => {
            setTotal(total);
            setPercentages(percentages);
          }}
        />

        <Accordion.Root type="multiple" className="mt-[50px] flex flex-col">
          {data.map((item, index) => (
            <Accordion.Item
              key={item.id}
              value={item.id}
              className="border-b-[1px] border-[var(--gray-9)] p-[5px]"
            >
              <Accordion.Header>
                <GroupHeader
                  item={item}
                  color={palette.one[index]}
                  percentage={percentages?.[index]}
                />
                <Accordion.Trigger>
                  <div className="ml-[20px] text-xs text-[var(--inverted)]">
                    See details
                  </div>
                </Accordion.Trigger>
              </Accordion.Header>

              <Accordion.Content>
                <GroupContent groupId={item.id} allTotal={total} />
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </main>
    </>
  );
}

function GroupHeader({
  color,
  item,
  percentage,
}: {
  color: string;
  item: BarChartData;
  percentage?: number;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex w-full shrink-0 items-center gap-[10px]">
        <div
          className="h-[10px] w-[10px] rounded-full"
          style={{ backgroundColor: color }}
        />
        <div className="flex-1">{item.name}</div>
        <div className="flex">
          <div className="w-[140px] text-right">
            <span>{item.value} </span>
            <span className="text-xs text-[var(--gray-9)]">days</span>
          </div>
          <div className="w-[140px] text-right">
            <span>{percentage}% </span>
            <span className="text-xs text-[var(--gray-9)]">of all group</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupContent({
  groupId,
  allTotal,
}: {
  groupId: string;
  allTotal?: number;
}) {
  const [data, setData] = useState<BarChartData[]>();
  const [percentages, setPercentages] = useState<number[]>();

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

      const total = dataMaped.reduce((sum, item) => sum + item.value, 0);

      const percentages = dataMaped.map((item) =>
        Math.round((item.value * 100) / total)
      );
      setPercentages(percentages);
    })();
  }, [groupId]);

  if (!data) {
    return null;
  }

  return (
    <div className="flex gap-[40px] py-[20px] pl-[20px] text-xs">
      {/* <PieChart
        size={100}
        data={data}
        colors={palette.two}
        onLoad={(total, percentages) => {
          setTotal(total);
          setPercentages(percentages);
        }}
      /> */}

      <div className="flex flex-1 flex-col gap-[10px]">
        {data.map((item, index) => (
          <div
            key={item.id}
            className="flex w-full shrink-0 items-center gap-[10px]"
          >
            {/* <div
              className="h-[10px] w-[10px] rounded-full"
              style={{ backgroundColor: palette.two[index] }}
            /> */}
            <div className="flex-1">{item.name}</div>

            <div className="flex">
              <div className="w-[130px] text-right">
                <span>{item.value} </span>
                <span className="text-xs text-[var(--gray-9)]">days</span>
              </div>
              {percentages !== undefined && (
                <div className="w-[130px] text-right">
                  <span>{percentages[index]}% </span>
                  <span className="text-xs text-[var(--gray-9)]">of group</span>
                </div>
              )}
              {allTotal !== undefined && (
                <div className="w-[140px] text-right">
                  <span>{Math.round((item.value * 100) / allTotal)}% </span>
                  <span className="text-xs text-[var(--gray-9)]">
                    of all group
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
