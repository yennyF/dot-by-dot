"use client";

import { ChevronLeftIcon } from "@radix-ui/react-icons";
import {
  AppTooltip,
  AppTrigger,
  AppContent,
} from "@/app/components/AppTooltip";
import { useScrollStore } from "@/app/stores/scrollStore";
import { useRef } from "react";
import { useTrackStore } from "@/app/stores/TrackStore";

export default function LeftButton() {
  const isAtLeft = useScrollStore((s) => s.isAtLeft);

  return isAtLeft ? <LoadMoreButton /> : <LeftButtonContent />;
}

function LeftButtonContent() {
  const scrollToLeft = useScrollStore((s) => s.scrollToLeft);

  const handleClick = async () => {
    scrollToLeft();
  };

  return (
    <AppTooltip>
      <AppTrigger asChild>
        <button className="button-outline button-sm" onClick={handleClick}>
          <ChevronLeftIcon />
        </button>
      </AppTrigger>
      <AppContent>Go previous</AppContent>
    </AppTooltip>
  );
}

function LoadMoreButton() {
  const fetchMoreTracks = useTrackStore((s) => s.fetchMoreTracks);
  const contentRef = useScrollStore((s) => s.contentRef);
  const scrollToLeft = useScrollStore((s) => s.scrollToLeft);

  const prevScrollLeft = useRef<number>(0);
  const prevScrollWidth = useRef<number>(0);

  const handleClick = async () => {
    const el = contentRef.current;
    if (!el) return;

    prevScrollWidth.current = el.scrollWidth;
    prevScrollLeft.current = el.scrollLeft;

    await fetchMoreTracks();

    // Move where it was
    const addedWidth = el.scrollWidth - prevScrollWidth.current;
    el.scrollLeft = prevScrollLeft.current + addedWidth;
    el.scrollTo({ left: el.scrollLeft, behavior: "smooth" });

    // Shift
    scrollToLeft();
  };

  return (
    <AppTooltip>
      <AppTrigger asChild>
        <button className="button-outline button-sm" onClick={handleClick}>
          <ChevronLeftIcon />
          More
        </button>
      </AppTrigger>
      <AppContent align="center">Load more</AppContent>
    </AppTooltip>
  );
}
