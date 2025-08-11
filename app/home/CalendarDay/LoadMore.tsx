"use client";

import { RefObject, useEffect, useState } from "react";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import AppTooltip from "@/app/components/AppTooltip";
import { useLoadMore } from "@/app/hooks/useLoadMore";

export default function LoadMore({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const { loadMore } = useLoadMore(scrollRef);

  const [height, setHeight] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!scrollRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === scrollRef.current) {
          setHeight(entry.contentRect.height);
        }
      }
    });

    resizeObserver.observe(scrollRef.current);

    return () => resizeObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = async () => {
    setIsLoading(true);
    await loadMore();
    setIsLoading(false);
  };

  return (
    // 110 header height
    // 15 shadow top/bottom height
    <div
      className="sticky top-[calc(110px+15px)] flex w-[30px] shrink-0 items-center justify-center"
      style={{ height: height - 110 - 15 - 15 + "px" }}
    >
      <AppTooltip content="Load more" contentClassName="z-10" asChild>
        <button
          className="button-icon-sheer"
          onClick={handleClick}
          disabled={isLoading}
        >
          <ArrowLeftIcon />
        </button>
      </AppTooltip>
    </div>
  );
}
