"use client";

import { RefObject, useEffect, useState } from "react";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useLoadMore } from "@/app/hooks/useLoadMore";
import {
  AppTooltip,
  AppTrigger,
  AppContent,
} from "@/app/components/AppTooltip";

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
      <AppTooltip>
        <AppTrigger asChild>
          <button
            className="button-icon-sheer"
            onClick={handleClick}
            disabled={isLoading}
          >
            <ArrowLeftIcon />
          </button>
        </AppTrigger>
        <AppContent className="z-10">Load more</AppContent>
      </AppTooltip>
    </div>
  );
}
