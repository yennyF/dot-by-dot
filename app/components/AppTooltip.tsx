import { Tooltip } from "radix-ui";

function AppTooltip({ children }: Tooltip.TooltipProps) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>{children}</Tooltip.Root>
    </Tooltip.Provider>
  );
}

function AppTrigger({ children, ...props }: Tooltip.TooltipTriggerProps) {
  return <Tooltip.Trigger {...props}>{children}</Tooltip.Trigger>;
}

function AppContent({
  children,
  className,
  side,
  sideOffset,
  ...props
}: Tooltip.TooltipContentProps) {
  return (
    <Tooltip.Portal>
      <Tooltip.Content
        {...props}
        className={`tooltip-content z-50 ${className}`}
        side={side ?? "bottom"}
        sideOffset={sideOffset ?? 5}
      >
        {children}
        <Tooltip.Arrow className="tooltip-arrow" />
      </Tooltip.Content>
    </Tooltip.Portal>
  );
}

export { AppTooltip, AppTrigger, AppContent };
