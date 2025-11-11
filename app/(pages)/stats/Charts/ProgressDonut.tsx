export function ProgressDonut({
  value,
  size = 120,
  color = "#4f46e5",
  thickness = 18,
}: {
  value: number;
  size?: number;
  color?: string;
  thickness?: number;
}) {
  const center = size / 2;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background ring */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke="#e6e6e6"
        strokeWidth={thickness}
        fill="none"
      />

      {/* Foreground ring */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke={color}
        strokeWidth={thickness}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${center} ${center})`}
      />
    </svg>
  );
}

// export function Donut({
//   size = 100,
//   thickness = 10,
//   color = "#4f46e5",
//   value = 75,
// }) {
//   const center = size / 2;
//   const radius = center - thickness / 2;
//   const angle = (value / 100) * 360;

//   const startAngle = -90; // start at top
//   const endAngle = startAngle + angle;

//   const startX = center + radius * Math.cos((startAngle * Math.PI) / 180);
//   const startY = center + radius * Math.sin((startAngle * Math.PI) / 180);
//   const endX = center + radius * Math.cos((endAngle * Math.PI) / 180);
//   const endY = center + radius * Math.sin((endAngle * Math.PI) / 180);

//   const largeArc = value > 50 ? 1 : 0;

//   const pathData = `
//     M ${startX} ${startY}
//     A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}
//   `;

//   return (
//     <svg width={size} height={size}>
//       {/* Background ring */}
//       <circle
//         cx={center}
//         cy={center}
//         r={radius}
//         stroke="#e6e6e6"
//         strokeWidth={thickness}
//         fill="none"
//       />

//       {/* Foreground arc (flat ends) */}
//       <path
//         d={pathData}
//         stroke={color}
//         strokeWidth={thickness}
//         fill="none"
//       />

//       {/* Rounded cap at the end */}
//       <circle cx={endX} cy={endY} r={thickness / 2} fill={color} />
//     </svg>
//   );
// }
