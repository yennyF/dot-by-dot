"use client";

import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Tooltip } from "radix-ui";
import stylesTooltip from "@/app/styles/tooltip.module.scss";
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
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="button-outline button-sm" onClick={handleClick}>
            <ChevronLeftIcon />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={stylesTooltip.content}
            align="center"
            side="bottom"
            sideOffset={5}
          >
            Go previous <Tooltip.Arrow className={stylesTooltip.arrow} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
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
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="button-outline button-sm" onClick={handleClick}>
            <ChevronLeftIcon />
            More
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={stylesTooltip.content}
            align="center"
            side="bottom"
            sideOffset={5}
          >
            Load more
            <Tooltip.Arrow className={stylesTooltip.arrow} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
