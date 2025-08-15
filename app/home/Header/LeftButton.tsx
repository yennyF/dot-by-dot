"use client";

import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useLoadMore } from "@/app/hooks/useLoadMore";
import {
  AppTooltip,
  AppTrigger,
  AppContent,
} from "@/app/components/AppTooltip";
import { scrollStore } from "@/app/stores/scrollStore";

export default function LeftButton() {
  const scrollRef = scrollStore((s) => s.calendarScrollRef);
  const isAtLeft = scrollStore((s) => s.isAtLeft);
  const scrollToLeft = scrollStore((s) => s.scrollToLeft);

  const { loadMore } = useLoadMore(scrollRef);

  const handleClick = async () => {
    if (isAtLeft) {
      await loadMore();
    } else {
      const el = scrollRef.current;
      if (!el) return;

      const offset = (el.clientWidth - 300) * 0.5;
      scrollToLeft(offset);
    }
  };

  return (
    <AppTooltip>
      <AppTrigger asChild>
        <button className="button-outline button-sm" onClick={handleClick}>
          <ChevronLeftIcon /> {isAtLeft ? "More" : ""}
        </button>
      </AppTrigger>
      <AppContent>{isAtLeft ? "Load more" : "Go previous"}</AppContent>
    </AppTooltip>
  );
}
