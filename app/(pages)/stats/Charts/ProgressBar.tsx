export function ProgressBar({
  value,
  size = 80,
  color = "#10b981",
  thickness = 6,
  start = 0,
}: {
  value: number;
  size?: number;
  color?: string;
  thickness?: number;
  start?: number;
}) {
  return (
    <div
      className="overflow-hidden rounded-full bg-[var(--gray-5)]"
      style={{ width: size + "px", height: thickness + "px" }}
    >
      <div
        className="relative h-full rounded-full"
        style={{
          left: start + "%",
          width: value + "%",
          backgroundColor: color,
        }}
      />
    </div>
  );
}
