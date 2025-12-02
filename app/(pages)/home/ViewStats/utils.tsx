import { Tooltip } from "radix-ui";
import stylesTooltip from "@/app/styles/tooltip.module.scss";
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
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger className="cursor-default">
              last 30 days
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className={stylesTooltip.content}
                align="center"
                side="top"
                sideOffset={5}
              >
                From {formattedFromDate} up today
                <Tooltip.Arrow className={stylesTooltip.arrow} />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
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
