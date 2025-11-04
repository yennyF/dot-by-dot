import { createContext, useContext, useEffect, useState } from "react";

export interface PieData {
  id: string;
  name: string;
  value: number;
  color: string;
}

interface PieContextProps {
  data: PieData[];
  size: number;
  total: number;
  cumulative: number[];
}

const PieContext = createContext<PieContextProps | undefined>(undefined);

export function PieProvider({
  children,
  size,
  data,
}: {
  children: React.ReactNode;
  size: number;
  data: PieData[];
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
  }, [data]);

  return (
    <PieContext.Provider
      value={{
        size,
        total,
        data,
        cumulative,
      }}
    >
      {children}
    </PieContext.Provider>
  );
}

export function PieChar() {
  const context = useContext(PieContext);
  if (!context) {
    throw new Error("PieChart must be used within PieProvider");
  }
  const { size, data } = context;

  const focusContext = useContext(FocusContext);
  if (!focusContext) {
    throw new Error("PieChartItem must be used within focusContext");
  }
  const { setFocusData } = focusContext;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      onPointerLeave={() => {
        setFocusData(undefined);
      }}
    >
      {/* <g transform="translate(250, 0) scale(-1, 1)"> */}
      {data.map((item, index) => {
        if (item.value === 0) return null;
        return (
          <PieChartItem
            key={index}
            data={item}
            color={colorPalette[index]}
            index={index}
          />
        );
      })}
      {/* </g> */}
    </svg>
  );
}

function PieChartItem({
  value,
  color,
  index,
}: {
  value: number;
  color: string;
  index: number;
}) {
  const context = useContext(PieContext);
  if (!context) {
    throw new Error("PieChartItem must be used within PieProvider");
  }
  const { size, cumulative, total } = context;

  const radius = size * 0.5;
  const center = size * 0.5;
  const innerRadius = radius * 0.5; // adjust thickness (0.6 = 60% inner hole)
  const startAngle = (cumulative[index] / total) * 2 * Math.PI;
  const endAngle = ((cumulative[index] + value) / total) * 2 * Math.PI;
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  // Full circle special case
  if (value >= 100) {
    return (
      <>
        <circle cx={center} cy={center} r={radius} fill={color} />
        <circle cx={center} cy={center} r={innerRadius} fill="white" />
      </>
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
