"use client";

import { RefObject } from "react";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import AppTooltip from "@/app/components/AppTooltip";
import UseScrollToRight from "@/app/hooks/UseScrollToRight";

export default function RightButton({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const { isAtRight, scrollToRightBy } = UseScrollToRight(scrollRef);

  const offset = scrollRef.current?.clientWidth
    ? (scrollRef.current?.clientWidth - 300) * 0.5
    : 0;

  const handleClick = async () => {
    scrollToRightBy(offset);
  };

  return (
    <>
      <AppTooltip content="Go next" contentClassName="z-40" asChild>
        <button
          className="button-outline button-sm"
          disabled={isAtRight}
          onClick={handleClick}
        >
          <ChevronRightIcon />
        </button>
      </AppTooltip>
    </>
  );
}
