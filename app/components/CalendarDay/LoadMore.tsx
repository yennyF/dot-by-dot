"use client";

import { RefObject, useEffect, useState } from "react";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "motion/react";
import { useTrackStore } from "@/app/stores/TrackStore";
import { subMonths } from "date-fns";
import LoadingIcon from "../Loading/LoadingIcon";

const threshold = 100;

export default function LoadMore({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const startDate = useTrackStore((s) => s.startDate);
  const loadMorePrevTracks = useTrackStore((s) => s.loadMorePrevTracks);

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

    const newStartDate = subMonths(startDate, 1);
    await loadMorePrevTracks(newStartDate);

    setIsLoading(false);
  };

  return (
    <div className="app-LoadMore sticky left-0 top-[calc(100vh*0.5+80px)] z-[10] h-0">
      <AnimatePresence>
        {isAtLeft && !isLoading && (
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
      {isLoading && (
        <div className="fixed bottom-[50px] left-1/2 translate-x-[-50%] p-2">
          <LoadingIcon />
        </div>
      )}
    </div>
  );
}
