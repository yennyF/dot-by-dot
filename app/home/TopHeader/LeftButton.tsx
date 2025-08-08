"use client";

import { RefObject } from "react";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import UseScrollToLeft from "@/app/hooks/UseScrollToLeft";
import { Tooltip } from "radix-ui";

export default function LeftButton({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const { isAtLeft, scrollToLeft } = UseScrollToLeft(scrollRef);

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            className="button-outline button-sm"
            disabled={isAtLeft}
            onClick={scrollToLeft}
          >
            <ChevronLeftIcon />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="tooltip-content z-40"
            side="bottom"
            sideOffset={5}
          >
            Go to oldest
            <Tooltip.Arrow className="tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
