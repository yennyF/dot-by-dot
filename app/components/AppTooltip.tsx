import { Tooltip } from "radix-ui";

function Root({ children, ...props }: Tooltip.TooltipProps) {
  return (
    <Tooltip.Provider {...props}>
      <Tooltip.Root>{children}</Tooltip.Root>
    </Tooltip.Provider>
  );
}

function Trigger({ children, ...props }: Tooltip.TooltipTriggerProps) {
  return <Tooltip.Trigger {...props}>{children}</Tooltip.Trigger>;
}

function Content({
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
        className={`tooltip-content z-50 ${className} `}
        side={side ?? "bottom"}
        sideOffset={sideOffset ?? 5}
      >
        {children}
        <Tooltip.Arrow className="tooltip-arrow" />
      </Tooltip.Content>
    </Tooltip.Portal>
  );
}

function ContentNonPortal({
  children,
  className,
  side,
  sideOffset,
  ...props
}: Tooltip.TooltipContentProps) {
  return (
    <Tooltip.Content
      {...props}
      className={`tooltip-content z-50 ${className} `}
      side={side ?? "bottom"}
      sideOffset={sideOffset ?? 5}
    >
      {children}
      <Tooltip.Arrow className="tooltip-arrow" />
    </Tooltip.Content>
  );
}

const AppTooltip = { Root, Trigger, Content, ContentNonPortal };
export default AppTooltip;
