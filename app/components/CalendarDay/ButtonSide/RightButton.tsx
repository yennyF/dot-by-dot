"use client";

import { RefObject, useEffect, useState } from "react";
import { ChevronRightIcon } from "@radix-ui/react-icons";

export default function RightButton({
  viewportRef,
}: {
  viewportRef: RefObject<HTMLDivElement | null>;
}) {
  const [isAtRight, setIsAtRight] = useState<boolean>(false);

  useEffect(() => {
    const container = viewportRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const isAtRight = scrollLeft + clientWidth >= scrollWidth;
      setIsAtRight(isAtRight);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [viewportRef]);

  const scrollToRight = () => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
  };

  useEffect(() => {
    console.log("RightButton rendered");
  });

  return (
    <button
      className="button-icon-sheer"
      disabled={isAtRight}
      onClick={scrollToRight}
    >
      <ChevronRightIcon />
    </button>
  );
}
