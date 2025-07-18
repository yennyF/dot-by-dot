"use client";

import { RefObject, useEffect, useState } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";

export default function ButtonBottom({
  viewportRef,
}: {
  viewportRef: RefObject<HTMLDivElement | null>;
}) {
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);

  useEffect(() => {
    const container = viewportRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight;
      setIsAtBottom(isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [viewportRef]);

  const scrollToBottom = () => {
    const el = viewportRef.current;
    if (!el) return;

    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    console.log("ButtonBottom rendered");
  });

  return (
    <button
      className="button-icon-sheer"
      disabled={isAtBottom}
      onClick={scrollToBottom}
    >
      <ChevronDownIcon />
    </button>
  );
}
