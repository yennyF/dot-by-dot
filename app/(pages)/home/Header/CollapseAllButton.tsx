import {
  AppTooltip,
  AppTooltipTrigger,
  AppContentTrigger,
} from "@/app/components/AppTooltip";
import { useUIStore } from "@/app/stores/useUIStore";
import { TextAlignMiddleIcon, LineHeightIcon } from "@radix-ui/react-icons";

export function CollapseAllButton() {
  const collapseAllGroups = useUIStore((s) => s.collapseAllGroups);

  return (
    <AppTooltip>
      <AppTooltipTrigger asChild>
        <button
          className="button-outline button-sm"
          onClick={() => {
            collapseAllGroups();
          }}
        >
          <TextAlignMiddleIcon />
        </button>
      </AppTooltipTrigger>
      <AppContentTrigger align="center">Collapse all</AppContentTrigger>
    </AppTooltip>
  );
}

export function ExpandAllButton() {
  const expandAllGroups = useUIStore((s) => s.expandAllGroups);

  return (
    <AppTooltip>
      <AppTooltipTrigger asChild>
        <button
          className="button-outline button-sm"
          onClick={() => {
            expandAllGroups();
          }}
        >
          <LineHeightIcon />
        </button>
      </AppTooltipTrigger>
      <AppContentTrigger align="center">Expand all</AppContentTrigger>
    </AppTooltip>
  );
}
