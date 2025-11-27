"use client";

import React from "react";
import { useUIStore } from "@/app/stores/useUIStore";
import { ProgressBar } from "../../../components/Charts/ProgressBar";
import clsx from "clsx";
import {
  BarChartDataExtend,
  ProgressDay,
  TaskLabel,
  GroupLabel,
} from "./utils";

export default function TabContentOften({
  data,
  daysDone,
}: {
  data: BarChartDataExtend[];
  daysDone: number;
}) {
  const setSelectedGroup = useUIStore((s) => s.setSelectedGroup);

  return (
    <>
      <ProgressDay>{daysDone}</ProgressDay>
      <div className="flex flex-col gap-[15px]">
        {data.map((item) => {
          const portion = Math.round((item.value * 100) / 30);
          return (
            <div key={item.id} className="flex flex-col gap-[1px]">
              {item.taskId ? (
                <TaskLabel>{item.name}</TaskLabel>
              ) : (
                <GroupLabel
                  onClick={() => {
                    setSelectedGroup(item.groupId);
                  }}
                >
                  {item.name}
                </GroupLabel>
              )}
              <ProgressBar
                value={portion}
                size={"100%"}
                thickness={15}
                color={item.taskId ? "var(--accent)" : "var(--inverted)"}
                bgColor="transparent"
              >
                <span
                  className={clsx(
                    "text-nowrap text-xs text-[var(--gray-9)]",
                    item.value > 0 && "mx-[10px]"
                  )}
                >
                  {item.value > 0 && item.value}
                  {item.value === 0
                    ? "None"
                    : item.value === 1
                      ? " Day"
                      : " Days"}
                </span>
              </ProgressBar>
            </div>
          );
        })}
      </div>
    </>
  );
}
