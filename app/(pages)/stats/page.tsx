"use client";

import { useEffect } from "react";
import AppHeader from "../../components/AppHeader";
import Loading from "../../components/Loading/Loading";
import { notifyLoadError } from "../../components/Notification";
import { useAppStore } from "../../stores/appStore";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../stores/userStore";
import GoBackButton from "@/app/components/GoBackButton";
import { PieChartRoot, PieData } from "./Pie";

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
  const data: PieData[] = [
    { label: "Completed", value: 40, color: "green" },
    { label: "In Progress", value: 30, color: "red" },
    { label: "Skipped", value: 10, color: "blue" },
  ];

  return (
    <>
      <AppHeader></AppHeader>
      <main className="page-main flex flex-col gap-[50px]">
        <GoBackButton />

        <section>
          <h1 className="page-title-1">Stats</h1>

          <div className="flex flex-col gap-[50px]">
            <PieChartRoot data={data} />
          </div>
        </section>
      </main>
    </>
  );
}
