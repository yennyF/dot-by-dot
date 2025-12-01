import AppTooltip from "@/app/components/AppTooltip";
import { BarChartData } from "@/app/components/Charts/Bar";
import { CubeIcon } from "@radix-ui/react-icons";
import { subDays } from "date-fns";

export interface BarChartDataExtend extends BarChartData {
  groupId: string | null;
  taskId?: string;
}

export function ProgressDay({ children }: { children: React.ReactNode }) {
  const fromDate = subDays(new Date(), 29);
  const formattedFromDate = fromDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="my-[30px] text-xs">
      <span className="text-[var(--gray-9)]">
        You logged progress on{" "}
        <span className="text-[var(--black)]"> {children} </span> of the{" "}
      </span>
      <span>
        <AppTooltip.Root>
          <AppTooltip.Trigger className="cursor-default">
            last 30 days
          </AppTooltip.Trigger>
          <AppTooltip.Content side="top">
            From {formattedFromDate} up today
          </AppTooltip.Content>
        </AppTooltip.Root>
      </span>
    </div>
  );
}

export function GroupLabel({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div
      className="flex cursor-pointer items-center gap-[10px]"
      onClick={onClick}
    >
      <CubeIcon className="text-[var(--gray-9)]" />
      <TaskLabel>{children} </TaskLabel>
    </div>
  );
}

export function TaskLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden text-ellipsis text-nowrap">
      {" "}
      {children}{" "}
    </div>
  );
}
