import { createContext, useContext, useEffect, useState } from "react";

interface PieContextProps {
  radius: number;
  center: number;
}

const PieContext = createContext({
  radius: 100,
  center: 100,
} as PieContextProps);

const PieProvider = ({ children }: { children: React.ReactNode }) => {
  const [radius] = useState(100);
  const [center] = useState(100);

  return (
    <PieContext
      value={{
        radius,
        center,
      }}
    >
      {children}
    </PieContext>
  );
};

export interface PieData {
  label: string;
  value: number;
  color: string;
}

export function PieChart({ data }: { data: PieData[] }) {
  const [cumulative, setCumulative] = useState<number[]>([]);

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
    <PieProvider>
      <svg width="200" height="200" viewBox="0 0 200 200">
        {data.map((item, index) => {
          return <Pie key={index} data={item} cumulative={cumulative[index]} />;
        })}
      </svg>
    </PieProvider>
  );
}

export function Pie({
  data,
  cumulative,
}: {
  data: PieData;
  cumulative: number;
}) {
  const { center, radius } = useContext(PieContext);

  const { value, color } = data;

  const startAngle = (cumulative / 100) * 2 * Math.PI;
  const endAngle = ((cumulative + value) / 100) * 2 * Math.PI;

  const x1 = center + radius * Math.sin(startAngle);
  const y1 = center - radius * Math.cos(startAngle);
  const x2 = center + radius * Math.sin(endAngle);
  const y2 = center - radius * Math.cos(endAngle);

  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  const pathData = `
          M ${center} ${center}
          L ${x1} ${y1}
          A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
          Z
        `;

  return <path d={pathData} fill={color} stroke="white" strokeWidth="1" />;
}
