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
import Link from "next/link";
import { CubeIcon } from "@radix-ui/react-icons";
import { ApiTaskLogDone } from "@/app/types";
import { colorPalette } from "./Charts/colors";

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
      <main className="page-main flex flex-col gap-[50px]">
        <GoBackButton />

        <h1 className="page-title-1">Stats</h1>

        <div>
          <span>Last 30 days</span>

          <div className="mt-[30px] flex items-center gap-[10px]">
            <CubeIcon className="size-[20px]" />
            <h2 className="flex-1 text-xl font-bold">All Groups</h2>
            <div>
              {total !== undefined && (
                <span className="text-xl font-bold">{total} </span>
              )}
              <span className="text-sm text-[var(--gray-9)]">total dots</span>
            </div>
          </div>

          <BarChart
            data={data}
            onLoad={(total, percentages) => {
              setTotal(total);
              setPercentages(percentages);
            }}
          />

          <div className="mt-[20px] flex flex-col gap-[10px]">
            {data.map((item, index) => (
              <div key={item.id} className="flex flex-col">
                <div className="flex w-full shrink-0 items-center gap-[10px]">
                  <div
                    className="h-[10px] w-[10px] rounded-full"
                    style={{ backgroundColor: colorPalette[index] }}
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
                <Link
                  href={`/stats/${item.id}`}
                  className="ml-[20px] text-xs text-[var(--inverted)]"
                >
                  See details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
