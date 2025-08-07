"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "motion/react";
import { useTrackStore } from "@/app/stores/TrackStore";
import LoadingIcon from "../../components/Loading/LoadingIcon";

const threshold = 100;

export default function LoadMore({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const loadMorePrevTracks = useTrackStore((s) => s.loadMorePrevTracks);

  const [isAtLeft, setIsAtLeft] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const prevScrollLeft = useRef<number>(0);
  const prevScrollWidth = useRef<number>(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isAtLeft = el.scrollLeft <= threshold;
      setIsAtLeft(isAtLeft);

      prevScrollLeft.current = el.scrollLeft;
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

  const handleClick = async () => {
    const el = scrollRef.current;
    if (!el) return;

    setIsLoading(true);

    prevScrollWidth.current = el.scrollWidth;
    prevScrollLeft.current = el.scrollLeft;

    await loadMorePrevTracks();

    requestAnimationFrame(() => {
      const newScrollWidth = el.scrollWidth;
      const addedWidth = newScrollWidth - prevScrollWidth.current;
      el.scrollLeft = prevScrollLeft.current + addedWidth;
      // el.scrollTo({ left: 0, behavior: "smooth" });
    });

    setIsLoading(false);
  };

  return (
    <div className="app-LoadMore sticky left-0 top-[calc(100vh*0.5+70px)] z-[10] h-0">
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
      {isLoading && <Loading />}
    </div>
  );
}

function Loading() {
  return (
    <div className="fixed bottom-[50px] left-1/2 flex translate-x-[-50%] items-center p-2">
      <LoadingIcon />
      Loading more…
    </div>
  );
}
