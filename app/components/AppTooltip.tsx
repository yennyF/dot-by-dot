import { Tooltip } from "radix-ui";
import { ReactNode } from "react";

interface AppTooltipProps {
  children: ReactNode;
  asChild?: boolean;
  content: ReactNode;
  contentClassName?: string;
}

export default function AppTooltip({
  children,
  asChild,
  content,
  contentClassName,
}: AppTooltipProps) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild={asChild}>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={`tooltip-content ${contentClassName}`}
            side="bottom"
            sideOffset={5}
          >
            {content}
            <Tooltip.Arrow className="tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
