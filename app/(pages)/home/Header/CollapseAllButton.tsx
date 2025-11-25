import AppTooltip from "@/app/components/AppTooltip";
import { useUIStore } from "@/app/stores/useUIStore";
import { TextAlignMiddleIcon, LineHeightIcon } from "@radix-ui/react-icons";

export function CollapseAllButton() {
  const closeAllGroups = useUIStore((s) => s.closeAllGroups);

  return (
    <AppTooltip.Root>
      <AppTooltip.Trigger asChild>
        <button
          className="button-outline button-sm"
          onClick={() => {
            closeAllGroups();
          }}
        >
          <TextAlignMiddleIcon />
        </button>
      </AppTooltip.Trigger>
      <AppTooltip.Content align="center">Collapse all</AppTooltip.Content>
    </AppTooltip.Root>
  );
}

export function ExpandAllButton() {
  const openAllGroups = useUIStore((s) => s.openAllGroups);

  return (
    <AppTooltip.Root>
      <AppTooltip.Trigger asChild>
        <button
          className="button-outline button-sm"
          onClick={() => {
            openAllGroups();
          }}
        >
          <LineHeightIcon />
        </button>
      </AppTooltip.Trigger>
      <AppTooltip.Content align="center">Expand all</AppTooltip.Content>
    </AppTooltip.Root>
  );
}
