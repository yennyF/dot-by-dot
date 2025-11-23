"use client";

import { Tabs } from "radix-ui";
import { BarChartData } from "../../stats/Charts/Bar";
import { palette } from "../../stats/Charts/colors";
import {
  ProgressBar,
  ProgressBarLabelDay,
  ProgressBarLabelPer,
} from "../../stats/Charts/ProgressBar";
import { StatTabStatus } from "../../stats/utils";
import AppTooltip from "@/app/components/AppTooltip";
import { subDays } from "date-fns";
import { CubeIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

export default function TabsStats({
  value,
  onValueChange,
  dataGroups,
  dataTasks,
  daysDone,
}: {
  value: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
  dataGroups: BarChartData[];
  dataTasks: BarChartData[];
  daysDone: number;
}) {
  const daysDonePer = Math.round((daysDone * 100) / 30);

  const fromDate = subDays(new Date(), 29);
  const formattedFromDate = fromDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Tabs.Root value={value} onValueChange={onValueChange}>
        <Tabs.List className="flex gap-[10px]" aria-label="Manage your account">
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

        <div className="my-[40px] text-xs">
          <span className="text-[var(--gray-9)]">
            You logged progress on{" "}
            <span className="text-[var(--black)]">
              {value === StatTabStatus.howOften ? daysDone : daysDonePer + "%"}
            </span>{" "}
            of the{" "}
          </span>
          <span>
            <AppTooltip.Root>
              <AppTooltip.Trigger className="cursor-default">
                last 30 days
              </AppTooltip.Trigger>
              <AppTooltip.Content side="top">
                From {formattedFromDate} up today
              </AppTooltip.Content>
            </AppTooltip.Root>
          </span>
        </div>

        <Tabs.Content value={StatTabStatus.howOften}>
          <TabsContentOne dataGroups={dataGroups} dataTasks={dataTasks} />
        </Tabs.Content>
        <Tabs.Content value={StatTabStatus.howEven}>
          <TabsContentTwo
            dataGroups={dataGroups}
            dataTasks={dataTasks}
            daysDonePer={daysDonePer}
          />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}

export function TabsContentOne({
  dataGroups,
  dataTasks,
}: {
  dataGroups: BarChartData[];
  dataTasks: BarChartData[];
}) {
  return (
    <div className="flex flex-col gap-[10px]">
      {dataTasks.map((item) => {
        const portion = Math.round((item.value * 100) / 30);
        return (
          <div key={item.id} className="flex gap-[10px]">
            <Label>{item.name}</Label>
            <div className="flex-1">
              <ProgressBar value={portion} size={"100%"} thickness={20}>
                <ProgressBarLabelDay value={item.value} />
              </ProgressBar>
            </div>
          </div>
        );
      })}
      {dataGroups.map((item) => {
        const portion = Math.round((item.value * 100) / 30);
        return (
          <div key={item.id} className="flex gap-[10px]">
            <Label isGroup={true}>{item.name}</Label>
            <div className="flex-1">
              <ProgressBar value={portion} size={"100%"} thickness={20}>
                <ProgressBarLabelDay value={item.value} />
              </ProgressBar>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TabsContentTwo({
  dataGroups,
  dataTasks,
  daysDonePer,
}: {
  dataGroups: BarChartData[];
  dataTasks: BarChartData[];
  daysDonePer: number;
}) {
  const totalData = [...dataTasks, ...dataGroups];

  const total = totalData.reduce((sum, item) => sum + item.value, 0);

  const portions = totalData.map((item) =>
    Math.round((item.value * daysDonePer) / total)
  );

  let acc = 0;
  const starts = portions.map((p) => {
    const current = acc;
    acc += p;
    return current;
  });

  return (
    <div className="flex flex-col gap-[10px]">
      {dataTasks.map((item, index) => {
        return (
          <div key={item.id} className="flex gap-[10px]">
            <Label>{item.name}</Label>
            <div className="flex-1">
              <ProgressBar
                value={portions[index]}
                size={"100%"}
                thickness={20}
                color={palette.one[index]}
                start={starts[index]}
              >
                <ProgressBarLabelPer value={item.value} />
              </ProgressBar>
            </div>
          </div>
        );
      })}
      {dataGroups.map((item, index) => {
        const shiftedIndex = index + dataTasks.length;
        return (
          <div key={item.id} className="flex gap-[10px]">
            <Label isGroup={true}>{item.name}</Label>
            <div className="flex-1">
              <ProgressBar
                value={portions[shiftedIndex]}
                size={"100%"}
                thickness={20}
                color={palette.one[shiftedIndex]}
                start={starts[shiftedIndex]}
              >
                <ProgressBarLabelPer value={item.value} />
              </ProgressBar>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Label({
  children,
  isGroup,
}: {
  children: React.ReactNode;
  isGroup?: boolean;
}) {
  return (
    <div className="flex h-[20px] w-[200px] items-center gap-[10px]">
      <CubeIcon
        className={clsx(!isGroup && "invisible", "text-[var(--gray-9)]")}
      />
      <span className="overflow-hidden text-ellipsis text-nowrap">
        {children}
      </span>
    </div>
  );
}
