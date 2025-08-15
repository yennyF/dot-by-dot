"use client";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import {
  AppTooltip,
  AppTrigger,
  AppContent,
} from "@/app/components/AppTooltip";
import { scrollStore } from "@/app/stores/scrollStore";

export default function RightButton() {
  const scrollRef = scrollStore((s) => s.calendarScrollRef);
  const isAtRight = scrollStore((s) => s.isAtRight);
  const scrollToRight = scrollStore((s) => s.scrollToRight);

  const handleClick = async () => {
    const el = scrollRef.current;
    if (!el) return;

    const offset = (el.clientWidth - 300) * 0.5;
    scrollToRight(offset);
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
      <AppContent>Go next</AppContent>
    </AppTooltip>
  );
}
