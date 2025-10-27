import { createContext, useContext, useEffect, useState } from "react";

interface PieContextProps {
  radius: number;
  center: number;
  cumulative: number[];
  setCumulative: React.Dispatch<React.SetStateAction<number[]>>;
}

const PieContext = createContext<PieContextProps | undefined>(undefined);

const PieProvider = ({ children }: { children: React.ReactNode }) => {
  const [radius] = useState(100);
  const [center] = useState(100);
  const [cumulative, setCumulative] = useState<number[]>([]);

  return (
    <PieContext.Provider
      value={{
        radius,
        center,
        cumulative,
        setCumulative,
      }}
    >
      {children}
    </PieContext.Provider>
  );
};

export interface PieData {
  label: string;
  value: number;
  color: string;
}

export function PieChartRoot({ data }: { data: PieData[] }) {
  return (
    <PieProvider>
      <PieChar data={data} />
    </PieProvider>
  );
}

export function PieChar({ data }: { data: PieData[] }) {
  const context = useContext(PieContext);
  if (!context) {
    throw new Error("PieChart must be used within PieProvider");
  }
  const { setCumulative } = context;

  useEffect(() => {
    const array: number[] = [];
    data.reduce((sum, item) => {
      array.push(sum);
      sum += item.value;
      return sum;
    }, 0);
    setCumulative(array);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <g transform="translate(200, 0) scale(-1, 1)">
        {data.map((item, index) => {
          return (
            <PieChartItem
              key={index}
              value={item.value}
              color={item.color}
              index={index}
            />
          );
        })}
      </g>
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
  const { center, radius, cumulative } = context;

  const innerRadius = radius * 0.6; // adjust thickness (0.6 = 60% inner hole)
  const start = cumulative[index] ?? 0;
  const startAngle = (start / 100) * 2 * Math.PI;
  const endAngle = ((start + value) / 100) * 2 * Math.PI;

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

  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

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
