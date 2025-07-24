"use client";

import { RefObject, use, useEffect, useState } from "react";
import { AppContext } from "../../AppContext";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "motion/react";

const threshold = 100;

export default function LoadMore({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarDay must be used within a AppProvider");
  }
  const { decreaseMinDate } = appContext;

  const [isAtLeft, setIsAtLeft] = useState<boolean>(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isAtLeft = el.scrollLeft <= threshold;
      setIsAtLeft(isAtLeft);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const isAtLeft = el.scrollLeft <= threshold;
    setIsAtLeft(isAtLeft);
  }, [scrollRef]);

  const handleClick = () => {
    const el = scrollRef.current;
    if (!el) return;

    const previousScrollLeft = el.scrollLeft;
    const previousScrollWidth = el.scrollWidth;

    decreaseMinDate();

    requestAnimationFrame(() => {
      const newScrollWidth = el.scrollWidth;
      const addedWidth = newScrollWidth - previousScrollWidth;
      el.scrollLeft = previousScrollLeft + addedWidth;
      // el.scrollTo({
      //   left: previousScrollLeft + addedWidth,
      //   behavior: "smooth",
      // });
    });
  };

  return (
    <div className="sticky top-[calc((100vh*0.5)+80px+(23*0.5px))] z-[10] h-0">
      <AnimatePresence>
        {isAtLeft && (
          <motion.button
            className="button-icon-inverted sticky left-[280px]"
            onClick={handleClick}
            initial={{ opacity: 0, x: 0 }}
            animate={{
              opacity: 1,
              x: [0, -10, 0], // move left and back
              transition: {
                opacity: { duration: 0.2 },
                x: {
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: "loop", // or "reverse" if you prefer
                  ease: "easeInOut",
                },
              },
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowLeftIcon />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
