"use client";

import React from "react";
import { ProgressBar } from "../../../components/Charts/ProgressBar";
import { palette } from "../../../components/Charts/colors";
import clsx from "clsx";
import {
  BarChartDataExtend,
  GroupLabel,
  ProgressDay,
  TaskLabel,
} from "./utils";
import { ViewStatsContext } from "./ViewStatsContext";

export default function TabContentEven({
  data,
  daysDone,
}: {
  data: BarChartDataExtend[];
  daysDone: number;
}) {
  const { setSelectedGroup } = React.use(ViewStatsContext);

  const daysDonePer = Math.round((daysDone * 100) / 30);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const portions = data.map((item) =>
    Math.round((item.value * daysDonePer) / total)
  );

  let acc = 0;
  const starts = portions.map((p) => {
    const current = acc;
    acc += p;
    return current;
  });

  return (
    <>
      <ProgressDay>{daysDonePer}</ProgressDay>
      <div className="flex flex-col gap-[15px]">
        {data.map((item, index) => {
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
                value={portions[index]}
                size={"100%"}
                thickness={15}
                color={palette.one[index]}
                start={starts[index]}
                // bgColor="transparent"
              >
                <span
                  className={clsx(
                    "text-nowrap text-xs text-[var(--gray-9)]",
                    item.value > 0 && "mx-[10px]"
                  )}
                >
                  {item.value === 0 ? null : item.value + "%"}
                </span>
              </ProgressBar>
            </div>
          );
        })}
      </div>
    </>
  );
}
