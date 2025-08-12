"use client";

import { RefObject } from "react";
import { ChevronUpIcon } from "@radix-ui/react-icons";
import AppTooltip from "@/app/components/AppTooltip";
import UseScrollToTop from "@/app/hooks/UseScrollToTop";

export default function UpButton({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const { isAtTop, scrollToTop } = UseScrollToTop(scrollRef);

  const handleClick = async () => {
    const offset = scrollRef.current?.clientHeight
      ? (scrollRef.current?.clientHeight - 110) * 0.5
      : 0;
    scrollToTop();
  };

  return (
    <>
      <AppTooltip content="Go next" contentClassName="z-40" asChild>
        <button
          className="button-outline button-sm"
          disabled={isAtTop}
          onClick={handleClick}
        >
          <ChevronUpIcon />
        </button>
      </AppTooltip>
    </>
  );
}
