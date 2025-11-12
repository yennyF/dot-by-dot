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
import { subDays } from "date-fns";
import {
  AppTooltip,
  AppTooltipTrigger,
  AppContentTrigger,
} from "@/app/components/AppTooltip";

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
  const [activeTab, setActiveStatTab] = useState<StatTabStatus>(
    StatTabStatus.howOften
  );

  const fromDate = subDays(new Date(), 29);
  const formattedFromDate = fromDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <AppHeader></AppHeader>
      <main className="page-main flex flex-col">
        <GoBackButton />

        <h1 className="page-title-1 mt-[20px]">Stats</h1>

        <Breadcrums
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        />

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
          <div className="tems-center my-[30px] flex items-center justify-between">
            <Tabs.List
              className="flex gap-[10px]"
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

            <AppTooltip>
              <AppTooltipTrigger className="cursor-default">
                Last 30 days
              </AppTooltipTrigger>
              <AppContentTrigger side="top">
                From {formattedFromDate} up today
              </AppContentTrigger>
            </AppTooltip>
          </div>

          {selectedData ? (
            <GroupDetail groupId={selectedData.id} activeTab={activeTab} />
          ) : (
            <GroupAll setSelectedData={setSelectedData} activeTab={activeTab} />
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
