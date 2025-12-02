import { useUIStore } from "@/app/stores/useUIStore";
import { TextAlignMiddleIcon, LineHeightIcon } from "@radix-ui/react-icons";
import { Tooltip } from "radix-ui";
import stylesTooltip from "@/app/styles/tooltip.module.scss";

export function CollapseAllButton() {
  const closeAllGroups = useUIStore((s) => s.closeAllGroups);

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            className="button-outline button-sm"
            onClick={() => {
              closeAllGroups();
            }}
          >
            <TextAlignMiddleIcon />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={stylesTooltip.content}
            align="center"
            side="bottom"
            sideOffset={5}
          >
            Collapse all
            <Tooltip.Arrow className={stylesTooltip.arrow} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

export function ExpandAllButton() {
  const openAllGroups = useUIStore((s) => s.openAllGroups);

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            className="button-outline button-sm"
            onClick={() => {
              openAllGroups();
            }}
          >
            <LineHeightIcon />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={stylesTooltip.content}
            align="center"
            side="bottom"
            sideOffset={5}
          >
            Expand all
            <Tooltip.Arrow className={stylesTooltip.arrow} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
