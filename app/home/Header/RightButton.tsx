"use client";

import { RefObject } from "react";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import UseScrollToRight from "@/app/hooks/UseScrollToRight";
import {
  AppTooltip,
  AppTrigger,
  AppContent,
} from "@/app/components/AppTooltip";

export default function RightButton({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const { isAtRight, scrollToRightBy } = UseScrollToRight(scrollRef);

  const handleClick = async () => {
    const offset = scrollRef.current?.clientWidth
      ? (scrollRef.current?.clientWidth - 300) * 0.5
      : 0;
    scrollToRightBy(offset);
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
      <AppContent className="z-40">Go next</AppContent>
    </AppTooltip>
  );
}
