export function ProgressBar({
  value,
  size = 80,
  color = "#10b981",
  thickness = 6,
  start = 0,
  children,
}: {
  value: number;
  size?: number | string;
  color?: string;
  thickness?: number;
  start?: number;
  children?: React.ReactNode;
}) {
  const width = typeof size === "string" ? size : size + "px";

  return (
    <div
      className="relative flex items-center rounded-full bg-[var(--gray-5)]"
      style={{ width, height: thickness + "px" }}
    >
      <div
        className="absolute h-full rounded-full"
        style={{
          left: start + "%",
          width: value + "%",
          backgroundColor: color,
        }}
      />
      {children && (
        <div
          className="absolute mx-[10px]"
          style={{ left: start + value + "%" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
