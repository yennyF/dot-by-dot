"use client";

import { RefObject, useEffect, useState } from "react";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

export default function LeftButton({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
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
    scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  useEffect(() => {
    console.log("LeftButton rendered");
  });

  return (
    <button
      className="button-icon-sheer"
      disabled={isAtLeft}
      onClick={scrollToLeft}
    >
      <ChevronLeftIcon />
    </button>
  );
}
