"use client";

import { RefObject, useEffect, useState } from "react";

export default function UseScrollToRight(
  scrollRef: RefObject<HTMLDivElement | null>
) {
  const [isAtRight, setIsAtRight] = useState<boolean>(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const isAtRight = scrollLeft + clientWidth >= scrollWidth;
      setIsAtRight(isAtRight);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollRef]);

  const scrollToRight = () => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
  };

  const scrollToRightBy = (offset: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft } = el;
    el.scrollTo({ left: scrollLeft + offset, behavior: "smooth" });
  };

  return { isAtRight, scrollToRight, scrollToRightBy };
}
