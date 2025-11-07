"use client";

import { use, useEffect, useState } from "react";
import Loading from "../../../components/Loading/Loading";
import { supabase } from "@/app/supabase/server";
import { ApiTaskLogDone, Group, mapGroupResponse } from "@/app/types";
import AppHeader from "@/app/components/AppHeader";
import { CubeIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { notifyLoadError } from "@/app/components/Notification";
import { useAppStore } from "@/app/stores/appStore";
import { useUserStore } from "@/app/stores/userStore";
import { BarChart, BarChartData } from "../Charts/Bar";

import GoBackButton from "@/app/components/GoBackButton";
import { palette } from "../Charts/colors";

interface ParamsType {
  params: Promise<{ group_id: string }>;
}

export default function StatsGroupPage({ params }: ParamsType) {
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

  return user && isEmpty === false ? <Content params={params} /> : <Loading />;
}

function Content({ params }: ParamsType) {
  const { group_id } = use(params);

  const [group, setGroup] = useState<Group>();
  const [data, setData] = useState<BarChartData[]>();
  const [total, setTotal] = useState<number>();
  const [percentages, setPercentages] = useState<number[]>();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("id", group_id)
        .single();

      if (error) throw data;

      setGroup(mapGroupResponse(data));
    })();

    (async () => {
      const { data, error } = await supabase.rpc("task_days_done_last_30", {
        p_group_id: group_id,
      });

      if (error) throw error;

      const dataMaped = (data as ApiTaskLogDone[]).map((item) => ({
        id: item.id,
        name: item.name,
        value: item.days_done,
      }));
      setData(dataMaped);
    })();
  }, [group_id]);

  if (!group || !data) {
    return <Loading />;
  }

  return (
    <>
      <AppHeader></AppHeader>
      <main className="page-main flex flex-col gap-[50px]">
        <GoBackButton path="/stats">Go back to all group</GoBackButton>

        <h1 className="page-title-1">Stats</h1>
        <span>Last 30 days</span>

        <div>
          <div className="flex w-full items-center gap-[10px]">
            <CubeIcon className="size-[25px]" />
            <h2 className="flex-1 text-2xl font-bold">{group.name}</h2>
            <div>
              {total !== undefined && (
                <span className="text-2xl font-bold">{total} </span>
              )}
              <span className="text-[var(--gray-9)]">total dots</span>
            </div>
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

          <div className="mt-[20px] flex flex-col gap-[10px]">
            {data.map((item, index) => (
              <div
                key={item.id}
                className="flex w-full shrink-0 items-center gap-[10px]"
              >
                <div
                  className="h-[10px] w-[10px] rounded-full"
                  style={{ backgroundColor: palette.two[index] }}
                />
                <div className="flex-1">{item.name}</div>

                <div className="flex">
                  <div className="text-right">
                    <span>{item.value} </span>
                    <span className="text-xs text-[var(--gray-9)]">dots</span>
                  </div>
                  <span className="mx-[10px] text-[var(--gray-9)]">-</span>
                  <div>
                    <span>{percentages?.[index]}% </span>
                    <span className="text-xs text-[var(--gray-9)]">
                      of total
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
