"use client";

import { ChevronLeftIcon } from "@radix-ui/react-icons";
import AppTooltip from "@/app/components/AppTooltip";
import { useScrollStore } from "@/app/stores/scrollStore";
import { useRef } from "react";
import { useTaskLogStore } from "@/app/stores/taskLogStore";

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
    <AppTooltip.Root>
      <AppTooltip.Trigger asChild>
        <button className="button-outline button-sm" onClick={handleClick}>
          <ChevronLeftIcon />
        </button>
      </AppTooltip.Trigger>
      <AppTooltip.Content>Go previous</AppTooltip.Content>
    </AppTooltip.Root>
  );
}

function LoadMoreButton() {
  const fetchMoreTaskLogs = useTaskLogStore((s) => s.fetchMoreTaskLogs);
  const taskLogRef = useScrollStore((s) => s.taskLogRef);
  const scrollToLeft = useScrollStore((s) => s.scrollToLeft);

  const prevScrollLeft = useRef<number>(0);
  const prevScrollWidth = useRef<number>(0);

  const handleClick = async () => {
    const el = taskLogRef.current;
    if (!el) return;

    prevScrollWidth.current = el.scrollWidth;
    prevScrollLeft.current = el.scrollLeft;

    await fetchMoreTaskLogs();

    // Move where it was
    const addedWidth = el.scrollWidth - prevScrollWidth.current;
    el.scrollLeft = prevScrollLeft.current + addedWidth;
    el.scrollTo({ left: el.scrollLeft, behavior: "smooth" });

    // Shift
    scrollToLeft();
  };

  return (
    <AppTooltip.Root>
      <AppTooltip.Trigger asChild>
        <button className="button-outline button-sm" onClick={handleClick}>
          <ChevronLeftIcon />
          More
        </button>
      </AppTooltip.Trigger>
      <AppTooltip.Content align="center">Load more</AppTooltip.Content>
    </AppTooltip.Root>
  );
}
