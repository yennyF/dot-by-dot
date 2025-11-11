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
import { Tabs } from "radix-ui";
import { StatTabStatus } from "./utils";

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
  const [activeTab, setActiveStatTab] = useState<StatTabStatus>();

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

        <Tabs.Root
          defaultValue={activeTab}
          onValueChange={(value) => {
            if (value === StatTabStatus.howOften) {
              setActiveStatTab(StatTabStatus.howOften);
            } else {
              setActiveStatTab(StatTabStatus.howEven);
            }
          }}
        >
          <Tabs.List
            className="mb-[50px] flex gap-[10px]"
            aria-label="Manage your account"
          >
            <Tabs.Trigger
              value={StatTabStatus.howOften}
              className="button-tab button-sm"
            >
              How often
            </Tabs.Trigger>
            <Tabs.Trigger
              value={StatTabStatus.howEven}
              className="button-tab button-sm"
            >
              How even
            </Tabs.Trigger>
          </Tabs.List>
          {selectedData ? (
            <GroupDetail groupId={selectedData.id} />
          ) : (
            <GroupAll setSelectedData={setSelectedData} />
          )}
        </Tabs.Root>
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
