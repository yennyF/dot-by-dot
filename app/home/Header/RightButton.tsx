"use client";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import {
  AppTooltip,
  AppTrigger,
  AppContent,
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
      <AppTrigger asChild>
        <button
          className="button-outline button-sm"
          disabled={isAtRight}
          onClick={handleClick}
        >
          <ChevronRightIcon />
        </button>
      </AppTrigger>
      <AppContent align="center">Go next</AppContent>
    </AppTooltip>
  );
}
