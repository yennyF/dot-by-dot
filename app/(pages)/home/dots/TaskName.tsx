import clsx from "clsx";

export default function TaskName({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx("flex w-full items-center overflow-hidden", className)}
    >
      <span className="overflow-hidden text-ellipsis text-nowrap">
        {children}
      </span>
    </div>
  );
}
