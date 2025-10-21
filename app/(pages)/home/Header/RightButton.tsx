"use client";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import {
  AppTooltip,
  AppTooltipTrigger,
  AppContentTrigger,
} from "@/app/components/AppTooltip";
import { useScrollStore } from "@/app/stores/scrollStore";

export default function RightButton() {
  const isAtRight = useScrollStore((s) => s.isAtRight);
  const scrollToRight = useScrollStore((s) => s.scrollToRight);

  const handleClick = async () => {
    scrollToRight();
  };

  return (
    <AppTooltip>
      <AppTooltipTrigger asChild>
        <button
          className="button-outline button-sm"
          disabled={isAtRight}
          onClick={handleClick}
        >
          <ChevronRightIcon />
        </button>
      </AppTooltipTrigger>
      <AppContentTrigger align="center">Go next</AppContentTrigger>
    </AppTooltip>
  );
}
