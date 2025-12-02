import { CubeIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

export default function GroupName({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={clsx("flex items-center gap-2 overflow-hidden", className)}
      onClick={onClick}
    >
      <CubeIcon className="size-[12px] shrink-0" />
      <span className="overflow-hidden text-ellipsis text-nowrap font-bold">
        {children}
      </span>
    </div>
  );
}
