"use client";

import { RefObject } from "react";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import UseScrollToLeft from "@/app/hooks/UseScrollToLeft";

export default function LeftButton({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const { isAtLeft, scrollToLeft } = UseScrollToLeft(scrollRef);

  return (
    <button
      className="button-outline px-4"
      disabled={isAtLeft}
      onClick={scrollToLeft}
    >
      <ChevronLeftIcon />
    </button>
  );
}
