"use client";

import { useEffect, useState } from "react";
import Loading from "../../components/Loading/Loading";
import { colorPalette, PieChartRoot, PieData } from "./Pie";
import { supabase } from "@/app/supabase/server";
import { ApiTaskLogDone, Group } from "@/app/types";

export function GroupSection({ group }: { group: Pick<Group, "id" | "name"> }) {
  const [result, setResult] = useState<
    { total: number; pieData: PieData[] } | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("task_days_done_last_30", {
        p_group_id: group.id,
      });

      if (error) throw error;

      const result = mapApiTaskLogDoneArray(data);
      setResult(result);
    })();
  }, [group.id]);

  if (!result) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex items-center p-[20px]">
        <div className="w-1/2">
          <h2 className="text-xl font-bold">{group.name}</h2>
          <div>
            <span className="text-lg">{result.total}</span>{" "}
            <span className="text-[var(--gray-9)]">total dots</span>
          </div>
        </div>

        <div className="flex w-1/2 justify-end">
          {result.total > 0 && <PieChartRoot data={result.pieData} />}
        </div>
      </div>

      <div className="flex flex-col gap-[5px]">
        {result.pieData.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-2 rounded-md bg-[var(--gray)] p-[10px]"
          >
            <div
              className="h-[10px] w-[10px] rounded-full"
              style={{ backgroundColor: colorPalette[index] }}
            ></div>
            <div className="flex w-full items-center justify-between gap-[20px]">
              <div>{item.name}</div>

              <div className="flex">
                <div className="w-[15 0px] text-right">
                  {Math.round(item.daysDone)}{" "}
                  <span className="text-xs text-[var(--gray-9)]">dots</span>
                </div>
                <div className="w-[150px] text-right">
                  {Math.round(item.value)}%
                  <span className="text-xs text-[var(--gray-9)]">
                    {" "}
                    of total
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function mapApiTaskLogDoneArray(data: ApiTaskLogDone[]) {
  const total = data.reduce((acc, r) => acc + r.days_done, 0);

  const pieData: PieData[] = data.map((r, index) => ({
    id: r.id,
    name: r.name,
    daysDone: r.days_done,
    value: total === 0 ? 0 : Number(((r.days_done / total) * 100).toFixed(2)),
    color: colorPalette[index],
  }));

  return { total, pieData };
}
