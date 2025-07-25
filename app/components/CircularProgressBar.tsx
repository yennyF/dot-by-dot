"use client";

type CircularProgressProps = {
  progress: number; // value between 0 and 1
  size?: number; // diameter in px
  strokeWidth?: number;
  barColor?: string;
  bgColor?: string;
};

// Smoother animation but not rounded bar circular progress
// export default function CircularProgressBar({
//   progress,
//   size = 24,
//   strokeWidth = 4,
//   barColor = "var(--accent)",
//   bgColor = "transparent",
// }: CircularProgressProps) {
//   const percentage = Math.min(Math.max(progress, 0), 1) * 100;

//   return (
//     <div
//       className="flex items-center justify-center rounded-full"
//       style={{
//         width: size,
//         height: size,
//         background: `conic-gradient(${barColor} ${percentage}%, ${bgColor} ${percentage}%)`,
//       }}
//     >
//       <div
//         className="rounded-full"
//         style={{
//           width: size - strokeWidth * 2,
//           height: size - strokeWidth * 2,
//           backgroundColor: "white",
//         }}
//       />
//     </div>
//   );
// }

// Slower animation but rounded bar circular progress
export default function CircularProgressBar({
  progress,
  size = 24,
  strokeWidth = 4,
  barColor = "var(--accent)",
  bgColor = "transparent",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference * (1 - Math.min(Math.max(progress, 0), 1));

  return (
    <svg
      width={size}
      height={size}
      style={{ display: "block" }}
      viewBox={`0 0 ${size} ${size}`}
    >
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={bgColor}
        strokeWidth={strokeWidth}
        fill="none"
      />

      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={barColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} // Start from top
        style={{ transition: "stroke-dashoffset 0.2s linear" }}
      />
    </svg>
  );
}
