"use client";

import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import Loading from "../../components/Loading/Loading";
import { notifyLoadError } from "../../components/Notification";
import { useAppStore } from "../../stores/appStore";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../stores/userStore";
import GoBackButton from "@/app/components/GoBackButton";
import { PieChartRoot, PieData } from "./Pie";
import { useTaskLogStore } from "@/app/stores/taskLogStore";

const colorPalette = [
  "#4CAF50", // Green
  "#2196F3", // Blue
  "#FF9800", // Orange
  "#F44336", // Red
  "#9C27B0", // Purple
  "#00BCD4", // Cyan
  "#8BC34A", // Light Green
  "#FFEB3B", // Yellow
  "#795548", // Brown
  "#607D8B", // Blue Gray
];

// const data: PieData[] = [
//   { label: "Completed", value: 34, color: "green" },
//   { label: "In Progress", value: 8, color: "red" },
//   { label: "Skipped", value: 28, color: "blue" },
//   { label: "2", value: 28, color: "pink" },
//   { label: "4", value: 0, color: "yellow" },
// ];

export default function HomePage() {
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
  const taskDone = useTaskLogStore((s) => s.taskDone);
  const [pieData, setPieData] = useState<PieData[]>([]);

  useEffect(() => {
    // supabase.functions
    //   .invoke("hello-world", { body: { name: "React" } })
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    (async () => {
      const result = await taskDone("d38117a4-3cfd-4b1f-b5fb-0841dc204360");

      const sum =
        result?.reduce((acc, r) => {
          return acc + r.days_done;
        }, 0) ?? 0;

      const pieData: PieData[] = result.map((r, index) => ({
        id: r.task_id,
        name: r.name,
        value: Math.round((r.days_done / sum) * 100),
        color: colorPalette[index],
      }));
      setPieData(pieData);
    })();
  }, []);

  return (
    <>
      <AppHeader></AppHeader>
      <main className="page-main flex flex-col gap-[50px]">
        <GoBackButton />

        <section>
          <h1 className="page-title-1">Stats</h1>

          <div className="flex gap-[50px]">
            <div className="flex flex-col gap-[50px]">
              <PieChartRoot data={pieData} />
            </div>

            <div>
              {pieData.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div
                    className="h-[10px] w-[10px] rounded-full"
                    style={{ backgroundColor: colorPalette[index] }}
                  ></div>
                  <div key={item.id}>{item.name}</div>
                  <div>{item.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
