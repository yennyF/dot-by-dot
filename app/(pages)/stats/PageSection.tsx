"use client";

import { useEffect, useState } from "react";
import Loading from "../../components/Loading/Loading";
import { colorPalette, PieChartRoot, PieData } from "./Pie";
import { supabase } from "@/app/supabase/server";
import { ApiTaskLogDone } from "@/app/types";

export function PageSection() {
  const [result, setResult] = useState<
    { total: number; pieData: PieData[] } | undefined
  >(undefined);

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

      const result = mapApiTaskLogDoneArray(data);
      setResult(result);
    })();
  }, []);

  if (!result) {
    return <Loading />;
  }

  return (
    <div>
      <span className="text-xl">Last 30 days</span>

      <div>
        <span className="text-2xl font-bold">{result.total}</span>{" "}
        <span className="text-[var(--gray-9)]">total dots</span>
      </div>

      <div className="m-auto w-fit">
        <PieChartRoot data={result.pieData} />
      </div>

      <div className="mt-[20px] flex flex-col gap-[20px]">
        {result.pieData.map((item, index) => {
          const percent = Math.round((item.value * 100) / result.total);

          return (
            <div key={item.id} className="">
              <div className="flex items-center gap-2 rounded-md">
                <div className="flex w-full items-center justify-between gap-[20px]">
                  <div>{item.name}</div>

                  <div className="flex">
                    <div className="w-[120px] text-right">
                      {item.value}{" "}
                      <span className="text-xs text-[var(--gray-9)]">dots</span>
                    </div>
                    <div className="w-[120px] text-right">
                      {percent}%
                      <span className="text-xs text-[var(--gray-9)]">
                        {" "}
                        of total
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-[10px] rounded-md bg-[#e0e0e0]">
                <div
                  className="h-[10px] rounded-md"
                  style={{
                    backgroundColor: colorPalette[index],
                    width: `${percent}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function mapApiTaskLogDoneArray(data: ApiTaskLogDone[]) {
  const total = data.reduce((acc, r) => acc + r.days_done, 0);

  const pieData: PieData[] = data.map((r, index) => ({
    id: r.id,
    name: r.name,
    value: r.days_done,
    color: colorPalette[index],
  }));

  return { total, pieData };
}
