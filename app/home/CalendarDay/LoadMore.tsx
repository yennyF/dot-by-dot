"use client";

import { RefObject, useEffect, useState } from "react";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useTrackStore } from "@/app/stores/TrackStore";
import { Tooltip } from "radix-ui";

export default function LoadMore({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const loadMorePrevTracks = useTrackStore((s) => s.loadMorePrevTracks);

  const [height, setHeight] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const prevScrollLeft = useRef<number>(0);
  // const prevScrollWidth = useRef<number>(0);

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
  }, []);

  const handleClick = async () => {
    const el = scrollRef.current;
    if (!el) return;

    setIsLoading(true);

    // prevScrollWidth.current = el.scrollWidth;
    // prevScrollLeft.current = el.scrollLeft;

    await loadMorePrevTracks();

    requestAnimationFrame(() => {
      // const newScrollWidth = el.scrollWidth;
      // const addedWidth = newScrollWidth - prevScrollWidth.current;
      // el.scrollLeft = prevScrollLeft.current + addedWidth;
      el.scrollTo({ left: 0, behavior: "smooth" });
    });

    setIsLoading(false);
  };

  return (
    // 110 header height
    // 15 shadow top/bottom height
    <div
      className="sticky top-[calc(110px+15px)] flex w-[30px] shrink-0 items-center justify-center"
      style={{ height: height - 110 - 15 - 15 + "px" }}
    >
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              className="button-icon-sheer animate-bounce"
              onClick={handleClick}
              disabled={isLoading}
            >
              <ArrowLeftIcon />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="tooltip-content z-10"
              side="bottom"
              sideOffset={5}
            >
              Load more
              <Tooltip.Arrow className="tooltip-arrow" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}
