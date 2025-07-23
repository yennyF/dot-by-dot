"use client";

import { RefObject, useEffect, useState } from "react";
import { ChevronUpIcon } from "@radix-ui/react-icons";

export default function TopButton({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const [isAtTop, setIsAtTop] = useState<boolean>(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop } = container;
      const isAtTop = scrollTop === 0;
      setIsAtTop(isAtTop);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollRef]);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    console.log("TopButton rendered");
  });

  return (
    <button
      className="button-icon-sheer"
      disabled={isAtTop}
      onClick={scrollToTop}
    >
      <ChevronUpIcon />
    </button>
  );
}
