import { RefObject, useEffect, useCallback } from "react";

interface ScrollOptions {
  autoScroll?: boolean;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
  behavior?: ScrollBehavior;
}

const defaultOptions: ScrollOptions = {
  autoScroll: true,
  block: "end",
  inline: "nearest",
  behavior: "smooth",
};

export default function useScrollToTarget(
  ref: RefObject<HTMLElement | null>,
  options: ScrollOptions = defaultOptions
) {
  const { autoScroll, behavior, block, inline } = options;

  // Memoized scroll function to prevent unnecessary re-renders
  const scrollToTarget = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // Use requestAnimationFrame for smoother scrolling
    const animate = () => {
      try {
        el.scrollIntoView({
          behavior,
          block,
          inline,
        });
      } catch (error) {
        // Fallback to simpler scroll if scrollIntoView fails
        console.warn(
          "Smooth scroll failed, falling back to instant scroll:",
          error
        );
        el.scrollIntoView();
      }
    };

    // Request animation frame for better performance
    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [behavior, block, inline, ref]);

  useEffect(() => {
    if (!autoScroll) return;

    // Ensure DOM is ready before scrolling
    const timeoutId = setTimeout(scrollToTarget, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [autoScroll, scrollToTarget]);

  return scrollToTarget;
}
