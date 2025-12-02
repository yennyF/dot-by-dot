"use client";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Tooltip } from "radix-ui";
import stylesTooltip from "@/app/styles/tooltip.module.scss";
import { useScrollStore } from "@/app/stores/scrollStore";

export default function RightButton() {
  const isAtRight = useScrollStore((s) => s.isAtRight);
  const scrollToRight = useScrollStore((s) => s.scrollToRight);

  const handleClick = async () => {
    scrollToRight();
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            className="button-outline button-sm"
            disabled={isAtRight}
            onClick={handleClick}
          >
            <ChevronRightIcon />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={stylesTooltip.content}
            align="center"
            side="bottom"
            sideOffset={5}
          >
            Go next
            <Tooltip.Arrow className={stylesTooltip.arrow} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
