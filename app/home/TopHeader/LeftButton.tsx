"use client";

import { RefObject } from "react";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import UseScrollToLeft from "@/app/hooks/UseScrollToLeft";
import AppTooltip from "@/app/components/AppTooltip";

export default function LeftButton({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const { isAtLeft, scrollToLeft } = UseScrollToLeft(scrollRef);

  return (
    <AppTooltip content="Go to oldest" contentClassName="z-40" asChild>
      <button
        className="button-outline button-sm"
        disabled={isAtLeft}
        onClick={scrollToLeft}
      >
        <ChevronLeftIcon />
      </button>
    </AppTooltip>
  );
}
