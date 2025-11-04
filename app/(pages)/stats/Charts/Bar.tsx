import {
  AppContentTrigger,
  AppTooltip,
  AppTooltipTrigger,
} from "@/app/components/AppTooltip";
import React, { createContext, useContext, useEffect, useState } from "react";
import { colorPalette } from "./colors";

export interface BarChartData {
  id: string;
  name: string;
  value: number;
}

// const BarContext = createContext<number | undefined>(undefined);

// export function BarProvider({
//   children,
//   total,
// }: {
//   children: React.ReactNode;
//   total: number;
// }) {
//   return <BarContext.Provider value={total}>{children}</BarContext.Provider>;
// }

export function BarChart({
  data,
  onLoad,
}: {
  data: BarChartData[];
  onLoad?: (total: number, percentages: number[]) => void;
}) {
  const [percentages, setPercentages] = useState<number[]>([]);

  useEffect(() => {
    const total = data.reduce((acc, r) => acc + r.value, 0);

    const percentages = data.map((item) =>
      Math.round((item.value * 100) / total)
    );
    setPercentages(percentages);

    onLoad?.(total, percentages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="mt-[20px] flex">
      {data.map((item, index) => (
        <AppTooltip key={item.id} delayDuration={100}>
          <AppTooltipTrigger asChild>
            <BarChartItem
              width={percentages[index]}
              color={colorPalette[index]}
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
  );
}

export function BarChartTooltipItem({
  item,
  total,
  index,
}: {
  item: BarChartData;
  total: number;
  index: number;
}) {
  const width = Math.round((item.value * 100) / total);

  return (
    <AppTooltip key={item.id} delayDuration={100}>
      <AppTooltipTrigger asChild>
        <BarChartItem width={width} color={colorPalette[index]} />
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
  { width: number; color: string }
>(({ width, color, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className="flex h-[20px] flex-col rounded-full bg-black"
      style={{
        backgroundColor: color,
        width: `${width}%`,
      }}
      {...props}
    />
  );
});
BarChartItem.displayName = "BarChartItem";
