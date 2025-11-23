import { createContext, useEffect, useState } from "react";

export interface PieChartData {
  id: string;
  name: string;
  value: number;
}

const PieChartContext = createContext<
  | {
      data: PieChartData[];
      size: number;
      total: number;
      cumulative: number[];
    }
  | undefined
>(undefined);

export function PieChart({
  size,
  data,
  colors,
  onLoad,
}: {
  size: number;
  data: PieChartData[];
  colors: string[];
  onLoad?: (total: number, percentages: number[]) => void;
}) {
  const [cumulative, setCumulative] = useState<number[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const cumulative: number[] = [];
    const total = data.reduce((sum, item) => {
      cumulative.push(sum);
      return sum + item.value;
    }, 0);
    setCumulative(cumulative);
    setTotal(total);

    const percentages = data.map((item) =>
      Math.round((item.value * 100) / total)
    );

    onLoad?.(total, percentages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <PieChartContext.Provider
      value={{
        size,
        total,
        data,
        cumulative,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* <g transform="translate(250, 0) scale(-1, 1)"> */}
        {data.map((item, index) => {
          if (item.value === 0) return null;
          return (
            <PieChartItem
              key={index}
              value={item.value}
              color={colors[index]}
              total={total}
              size={size}
              start={cumulative[index]}
            />
          );
        })}
        {/* </g> */}
      </svg>
    </PieChartContext.Provider>
  );
}

function PieChartItem({
  value,
  color,
  size,
  total,
  start,
}: {
  value: number;
  color: string;
  size: number;
  total: number;
  start: number;
}) {
  const radius = size * 0.5;
  const center = size * 0.5;
  const innerRadius = radius * 0.5; // adjust thickness (0.6 = 60% inner hole)

  const fullCircle = 2 * Math.PI;
  const startAngle = (start / total) * fullCircle;
  const endAngle = ((start + value) / total) * fullCircle;
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  // Full circle special case
  if (value >= total) {
    return (
      <circle
        cx={center}
        cy={center}
        r={(radius + innerRadius) / 2} // midline of the band
        stroke={color}
        strokeWidth={radius - innerRadius} // thickness of the donut
        strokeLinecap="round"
        fill="none" // transparent hole
      />
    );
  }

  // Outer arc coordinates
  const x1 = center + radius * Math.sin(startAngle);
  const y1 = center - radius * Math.cos(startAngle);
  const x2 = center + radius * Math.sin(endAngle);
  const y2 = center - radius * Math.cos(endAngle);

  // Inner arc coordinates
  const x3 = center + innerRadius * Math.sin(endAngle);
  const y3 = center - innerRadius * Math.cos(endAngle);
  const x4 = center + innerRadius * Math.sin(startAngle);
  const y4 = center - innerRadius * Math.cos(startAngle);

  // Build donut path
  const pathData = `
    M ${x1} ${y1}
    A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
    L ${x3} ${y3}
    A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
    Z
  `;

  return <path d={pathData} fill={color} />;
}
