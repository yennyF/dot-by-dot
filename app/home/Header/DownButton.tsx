"use client";

import { RefObject } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import AppTooltip from "@/app/components/AppTooltip";
import UseScrollToBottom from "@/app/hooks/UseScrollToBottom";

export default function DownButton({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const { isAtBottom, scrollToBottom } = UseScrollToBottom(scrollRef);

  const handleClick = async () => {
    const offset = scrollRef.current?.clientHeight
      ? (scrollRef.current?.clientHeight - 110) * 0.5
      : 0;
    scrollToBottom();
  };

  return (
    <>
      <AppTooltip content="Go next" contentClassName="z-40" asChild>
        <button
          className="button-outline button-sm"
          disabled={isAtBottom}
          onClick={handleClick}
        >
          <ChevronDownIcon />
        </button>
      </AppTooltip>
    </>
  );
}
