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
    <div className="relative flex items-center">
      <div
        className="relative rounded-full bg-[var(--gray-5)]"
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
      </div>
      {children && (
        <div
          className="absolute mx-[10px] text-nowrap text-xs"
          style={{ left: start + value + "%" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function ProgressBarLabelDay({ value }: { value: number }) {
  if (value === 0) return null;

  return (
    <>
      <span>{value}</span>
      <span className="text-[var(--gray-9)]"> days</span>
    </>
  );
}

export function ProgressBarLabelPer({ value }: { value: number }) {
  if (value === 0) return null;

  return (
    <>
      <span>{value}</span>
      <span className="text-[var(--gray-9)]">%</span>
    </>
  );
}
