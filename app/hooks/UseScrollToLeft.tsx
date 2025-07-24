"use client";

import { RefObject, useEffect, useState } from "react";

export default function UseScrollToLeft(
  scrollRef: RefObject<HTMLDivElement | null>
) {
  const [isAtLeft, setIsAtLeft] = useState<boolean>(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft } = container;
      const isAtLeft = scrollLeft === 0;
      setIsAtLeft(isAtLeft);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollRef]);

  const scrollToLeft = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "smooth" });
  };

  return { isAtLeft, scrollToLeft };
}
