import { RefObject, useRef } from "react";
import { useTrackStore } from "../stores/TrackStore";

export function useLoadMore(scrollRef: RefObject<HTMLDivElement | null>) {
  const loadMorePrevTracks = useTrackStore((s) => s.loadMorePrevTracks);

  const prevScrollLeft = useRef<number>(0);
  const prevScrollWidth = useRef<number>(0);

  const offset = scrollRef.current?.clientWidth
    ? (scrollRef.current?.clientWidth - 300) * 0.5
    : 0;

  const loadMore = async () => {
    const el = scrollRef.current;
    if (!el) return;

    prevScrollWidth.current = el.scrollWidth;
    prevScrollLeft.current = el.scrollLeft;

    await loadMorePrevTracks();

    // requestAnimationFrame(() => {
    const newScrollWidth = el.scrollWidth;
    const addedWidth = newScrollWidth - prevScrollWidth.current;
    el.scrollLeft = prevScrollLeft.current + addedWidth;

    const { scrollLeft } = el;
    el.scrollTo({ left: scrollLeft - offset, behavior: "smooth" });
    // });
  };

  return { loadMore };
}
