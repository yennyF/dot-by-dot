import {
  AppContentTrigger,
  AppTooltip,
  AppTooltipTrigger,
} from "@/app/components/AppTooltip";
import React, { createContext, useEffect, useState } from "react";
import { palette } from "./colors";

export interface BarChartData {
  id: string;
  name: string;
  value: number;
}

const BarChartContext = createContext<
  | {
      data: BarChartData[];
      height: string;
      total: number;
      percentages: number[];
    }
  | undefined
>(undefined);

export function BarChart({
  height,
  data,
  colors,
  onLoad,
}: {
  height: string;
  data: BarChartData[];
  colors: string[];
  onLoad?: (total: number, percentages: number[]) => void;
}) {
  const [percentages, setPercentages] = useState<number[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const total = data.reduce((acc, r) => acc + r.value, 0);
    setTotal(total);

    const percentages = data.map((item) =>
      Math.round((item.value * 100) / total)
    );
    setPercentages(percentages);

    onLoad?.(total, percentages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <BarChartContext.Provider value={{ height, data, total, percentages }}>
      <div className="flex gap-[2px]">
        {data.map((item, index) => (
          <AppTooltip key={item.id} delayDuration={100}>
            <AppTooltipTrigger asChild>
              <BarChartItem
                width={percentages[index]}
                color={colors[index]}
                height={height}
              />
            </AppTooltipTrigger>
            <AppContentTrigger side="top" align="center" sideOffset={5}>
              <div className="flex flex-col items-end gap-[10px]">
                <div className="font-bold">{item.name}</div>
                <div>
                  <span>{item.value} </span>
                  <span className="text-[var(--gray-9)]">dots</span>
                </div>
                <div>
                  <span>{percentages[index]}%</span>
                  <span className="text-[var(--gray-9)]"> of total</span>
                </div>
              </div>
            </AppContentTrigger>
          </AppTooltip>
        ))}
      </div>
    </BarChartContext.Provider>
  );
}

export function BarChartTooltipItem({
  item,
  total,
  index,
  height,
}: {
  item: BarChartData;
  total: number;
  index: number;
  height: string;
}) {
  const width = Math.round((item.value * 100) / total);

  return (
    <AppTooltip key={item.id} delayDuration={100}>
      <AppTooltipTrigger asChild>
        <BarChartItem
          width={width}
          color={palette.one[index]}
          height={height}
        />
      </AppTooltipTrigger>
      <AppContentTrigger side="top" align="center" sideOffset={5}>
        <div className="flex flex-col items-end gap-[10px]">
          <div>{item.name}</div>
          <div>
            <span>{item.value} </span>
            <span className="text-[var(--gray-9)]">dots</span>
          </div>
        </div>
      </AppContentTrigger>
    </AppTooltip>
  );
}

const BarChartItem = React.forwardRef<
  HTMLDivElement,
  { width: number; color: string; height: string }
>(({ width, color, height, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className="flex flex-col rounded-full"
      style={{
        backgroundColor: color,
        width: `${width}%`,
        height: height,
      }}
      {...props}
    />
  );
});
BarChartItem.displayName = "BarChartItem";
