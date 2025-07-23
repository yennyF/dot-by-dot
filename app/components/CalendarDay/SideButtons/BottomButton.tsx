"use client";

import { RefObject, useEffect, useState } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";

export default function ButtonBottom({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight;
      setIsAtBottom(isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollRef]);

  const scrollToBottom = () => {
    const el = scrollRef.current;
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
