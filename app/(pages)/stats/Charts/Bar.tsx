import React, { createContext, useContext } from "react";

const BarContext = createContext<number | undefined>(undefined);

export function BarProvider({
  children,
  total,
}: {
  children: React.ReactNode;
  total: number;
}) {
  return <BarContext.Provider value={total}>{children}</BarContext.Provider>;
}

export function BarChart({ children }: { children: React.ReactNode }) {
  return <div className="mt-[20px] flex">{children}</div>;
}

export function BarChartItem({
  value,
  color,
}: {
  value: number;
  color: string;
}) {
  const total = useContext(BarContext);
  if (total === undefined) {
    return null;
  }

  const percent = Math.round((value * 100) / total);

  return (
    <div
      className="flex h-[20px] flex-col rounded-full"
      style={{
        backgroundColor: color,
        width: `${percent}%`,
      }}
    />
  );
}
