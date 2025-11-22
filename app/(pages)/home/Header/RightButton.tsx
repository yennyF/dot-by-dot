"use client";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import AppTooltip from "@/app/components/AppTooltip";
import { useScrollStore } from "@/app/stores/scrollStore";

export default function RightButton() {
  const isAtRight = useScrollStore((s) => s.isAtRight);
  const scrollToRight = useScrollStore((s) => s.scrollToRight);

  const handleClick = async () => {
    scrollToRight();
  };

  return (
    <AppTooltip.Root>
      <AppTooltip.Trigger asChild>
        <button
          className="button-outline button-sm"
          disabled={isAtRight}
          onClick={handleClick}
        >
          <ChevronRightIcon />
        </button>
      </AppTooltip.Trigger>
      <AppTooltip.Content align="center">Go next</AppTooltip.Content>
    </AppTooltip.Root>
  );
}
