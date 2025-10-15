import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { AppTooltip, AppTooltipTrigger, AppContentTrigger } from "./AppTooltip";

export default function TestModeTag() {
  return (
    <AppTooltip>
      <AppTooltipTrigger className="fixed bottom-5 right-5 z-[100] flex items-center gap-2 rounded-full bg-red-600 bg-opacity-50 px-4 py-2">
        <ExclamationTriangleIcon className="size-[11px] text-white" />
        <span className="text-xs tracking-wide text-white">TEST MODE</span>
      </AppTooltipTrigger>
      <AppContentTrigger side="top" align="end">
        <p className="leading-relaxed">
          Go ahead, break things!
          <br />
          (Mock data only)
        </p>
      </AppContentTrigger>
    </AppTooltip>
  );
}
