"use client";

import { RefObject, useEffect, useState } from "react";

export default function UseScrollToTop(
  scrollRef: RefObject<HTMLDivElement | null>
) {
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

  return { isAtTop, scrollToTop };
}
