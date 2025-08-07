"use client";

import { ReactNode } from "react";
import { Tooltip } from "radix-ui";

interface TooltipProps {
  children: ReactNode;
  message: string;
}

export default function AppTooltip({ children, message }: TooltipProps) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="tooltip-content z-40"
            side="bottom"
            sideOffset={5}
          >
            {message}
            <Tooltip.Arrow className="tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
