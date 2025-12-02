import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Tooltip } from "radix-ui";
import stylesTooltip from "@/app/styles/tooltip.module.scss";

export default function TestModeTag() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger className="fixed bottom-5 right-5 z-[100] flex items-center gap-2 rounded-full bg-red-600 bg-opacity-50 px-4 py-2">
          <ExclamationTriangleIcon className="size-[11px] text-white" />
          <span className="text-xs tracking-wide text-white">TEST MODE</span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={stylesTooltip.content}
            align="end"
            side="top"
            sideOffset={5}
          >
            <p className="leading-relaxed">
              Go ahead, break things!
              <br />
              (Mock data only)
            </p>
            <Tooltip.Arrow className={stylesTooltip.arrow} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
