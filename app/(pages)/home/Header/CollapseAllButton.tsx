import AppTooltip from "@/app/components/AppTooltip";
import { useUIStore } from "@/app/stores/useUIStore";
import { TextAlignMiddleIcon, LineHeightIcon } from "@radix-ui/react-icons";

export function CollapseAllButton() {
  const collapseAllGroups = useUIStore((s) => s.collapseAllGroups);

  return (
    <AppTooltip.Root>
      <AppTooltip.Trigger asChild>
        <button
          className="button-outline button-sm"
          onClick={() => {
            collapseAllGroups();
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
  const expandAllGroups = useUIStore((s) => s.expandAllGroups);

  return (
    <AppTooltip.Root>
      <AppTooltip.Trigger asChild>
        <button
          className="button-outline button-sm"
          onClick={() => {
            expandAllGroups();
          }}
        >
          <LineHeightIcon />
        </button>
      </AppTooltip.Trigger>
      <AppTooltip.Content align="center">Expand all</AppTooltip.Content>
    </AppTooltip.Root>
  );
}
