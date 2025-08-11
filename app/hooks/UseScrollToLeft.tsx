"use client";

import { RefObject, useEffect, useState } from "react";

export default function UseScrollToLeft(
  scrollRef: RefObject<HTMLDivElement | null>
) {
  const [isAtLeft, setIsAtLeft] = useState<boolean>(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollLeft } = el;
      const isAtLeft = scrollLeft === 0;
      setIsAtLeft(isAtLeft);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [scrollRef]);

  const scrollToLeft = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "smooth" });
  };

  const scrollToLeftBy = (offset: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft } = el;
    el.scrollTo({ left: scrollLeft - offset, behavior: "smooth" });
  };

  return { isAtLeft, scrollToLeft, scrollToLeftBy };
}
