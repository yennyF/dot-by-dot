"use client";

import { RefObject, use, useEffect, useState } from "react";
import { AppContext } from "../../AppContext";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "motion/react";
import { useTrackStore } from "@/app/stores/TrackStore";
import { subMonths } from "date-fns";
import clsx from "clsx";

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
  const { decreaseMinDate, minDate } = appContext;

  const loadMoreTracks = useTrackStore((s) => s.loadMoreTracks);

  const [isAtLeft, setIsAtLeft] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  // useEffect(() => {
  //   const el = scrollRef.current;
  //   if (!el) return;

  //   if (!isLoading) {
  //     requestAnimationFrame(() => {
  //       const newScrollWidth = el.scrollWidth;
  //       const addedWidth = newScrollWidth - previousScrollWidth;
  //       el.scrollLeft = previousScrollLeft + addedWidth;
  //       // el.scrollTo({
  //       //   left: previousScrollLeft + addedWidth,
  //       //   behavior: "smooth",
  //       // });
  //     });
  //   }
  // }, [isLoading]);

  const handleClick = async () => {
    const el = scrollRef.current;
    if (!el) return;

    setIsLoading(true);

    // const previousScrollLeft = el.scrollLeft;
    // const previousScrollWidth = el.scrollWidth;

    const newMinDate = subMonths(minDate, 1);
    await loadMoreTracks(newMinDate, minDate);
    decreaseMinDate();

    setIsLoading(false);
  };

  return (
    <div
      className={clsx(
        "app-LoadMore sticky top-[calc((100vh*0.5)+80px+(23*0.5px))] z-[10] h-0",
        isLoading && "opacity-30"
      )}
    >
      <AnimatePresence>
        {isAtLeft && (
          <motion.button
            className="button-icon-inverted sticky left-[280px]"
            disabled={isLoading}
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
