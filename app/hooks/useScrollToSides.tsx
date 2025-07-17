import { RefObject, DragEvent, useEffect, useState } from "react";

export default function useScrollToSides(ref: RefObject<HTMLElement | null>) {
  const [isAtTop, setIsAtTop] = useState<boolean>(false);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
  const [isAtLeft, setIsAtLeft] = useState<boolean>(false);
  const [isAtRight, setIsAtRight] = useState<boolean>(false);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const handleScroll = () => {
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollLeft,
        scrollWidth,
        clientWidth,
      } = container;

      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight;
      const isAtLeft = scrollLeft === 0;
      const isAtRight = scrollLeft + clientWidth >= scrollWidth;

      setIsAtTop(isAtTop);
      setIsAtBottom(isAtBottom);
      setIsAtLeft(isAtLeft);
      setIsAtRight(isAtRight);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [ref]);

  const scrollToTop = () => {
    ref.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    const el = ref.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  };

  const scrollToLeft = () => {
    ref.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  const scrollToRight = () => {
    const el = ref.current;
    if (el) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    }
  };

  const scrollVertically = (e: DragEvent) => {
    const el = ref.current;
    if (!el) return;

    const scrollSpeed = 5;
    // TODO handle custom threshold setup
    const threshold = { top: 150, bottom: 10 };

    const { top, bottom } = el.getBoundingClientRect();
    const y = e.clientY;
    const direction =
      y - top < threshold.top ? -1 : bottom - y < threshold.bottom ? 1 : 0;

    if (direction !== 0) el.scrollTop += direction * scrollSpeed;
  };

  return {
    isAtTop,
    isAtBottom,
    isAtLeft,
    isAtRight,
    scrollToTop,
    scrollToBottom,
    scrollToLeft,
    scrollToRight,
    scrollVertically,
  };
}
