"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import Loading from "../../components/Loading/Loading";
import { notifyLoadError } from "../../components/Notification";
import { useAppStore } from "../../stores/appStore";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../stores/userStore";
import GoBackButton from "@/app/components/GoBackButton";
import { BarChartData } from "./Charts/Bar";
import { CubeIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import GroupDetail from "./GroupDetail";
import GroupAll from "./GroupAll";

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
  const [selectedData, setSelectedData] = useState<BarChartData>();

  return (
    <>
      <AppHeader></AppHeader>
      <main className="page-main flex flex-col">
        <GoBackButton />

        <h1 className="page-title-1 mt-[20px]">Stats</h1>

        <div className="sticky top-[60px] bg-[var(--background)] py-[50px]">
          <span className="mt-[10px]">Last 30 days</span>
          <Breadcrums
            selectedData={selectedData}
            setSelectedData={setSelectedData}
          />
        </div>

        {selectedData ? (
          <GroupDetail groupId={selectedData.id} />
        ) : (
          <GroupAll setSelectedData={setSelectedData} />
        )}
      </main>
    </>
  );
}

function Breadcrums({
  selectedData,
  setSelectedData,
}: {
  selectedData: BarChartData | undefined;
  setSelectedData: Dispatch<SetStateAction<BarChartData | undefined>>;
}) {
  return (
    <div className="mb-[20px] mt-[20px] flex gap-[10px] text-xl">
      <button
        onClick={() => {
          setSelectedData(undefined);
        }}
        className={clsx(
          selectedData
            ? "font-normal underline decoration-1 underline-offset-8"
            : "font-bold"
        )}
      >
        All groups
      </button>
      {selectedData && (
        <>
          <span> / </span>
          <span className="flex items-center gap-[10px]">
            <CubeIcon className="size-[20px]" />
            <span className="font-bold">{selectedData.name}</span>
          </span>
        </>
      )}
    </div>
  );
}
