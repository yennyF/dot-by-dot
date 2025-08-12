"use client";

import { RefObject } from "react";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import UseScrollToLeft from "@/app/hooks/UseScrollToLeft";
import AppTooltip from "@/app/components/AppTooltip";
import { useLoadMore } from "@/app/hooks/useLoadMore";

export default function LeftButton({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const { isAtLeft, scrollToLeftBy } = UseScrollToLeft(scrollRef);

  const { loadMore } = useLoadMore(scrollRef);

  const handleClick = async () => {
    if (isAtLeft) {
      await loadMore();
    } else {
      const offset = scrollRef.current?.clientWidth
        ? (scrollRef.current?.clientWidth - 300) * 0.5
        : 0;
      scrollToLeftBy(offset);
    }
  };

  return (
    <AppTooltip
      content={isAtLeft ? "Load more" : "Go previous"}
      contentClassName="z-40"
      asChild
    >
      <button className="button-outline button-sm" onClick={handleClick}>
        <ChevronLeftIcon /> {isAtLeft ? "More" : ""}
      </button>
    </AppTooltip>
  );
}
