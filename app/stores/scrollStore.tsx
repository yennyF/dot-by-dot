import { create } from "zustand";
import { createRef, RefObject } from "react";

type State = {
  todayRef: RefObject<HTMLDivElement | null>;
  headerColRef: RefObject<HTMLDivElement | null>;
  headerRowRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;

  isAtLeft: boolean;
  isAtRight: boolean;
  isAtBottom: boolean;
  isAtTop: boolean;
};

type Action = {
  setIsAtLeft: () => void;
  setIsAtRight: () => void;
  setIsAtBottom: () => void;
  setIsAtTop: () => void;

  scrollToLeft: (forceToEnd?: boolean) => void;
  scrollToRight: (forceToEnd?: boolean) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
};

export const useScrollStore = create<Action & State>((set, get) => ({
  todayRef: createRef<HTMLDivElement>(),
  headerColRef: createRef<HTMLDivElement>(),
  headerRowRef: createRef<HTMLDivElement>(),
  contentRef: createRef<HTMLDivElement>(),

  isAtLeft: false,
  isAtRight: false,
  isAtTop: false,
  isAtBottom: false,

  setIsAtLeft: () => {
    const el = get().contentRef.current;
    if (!el) return;

    const { scrollLeft } = el;
    const isAtLeft = scrollLeft === 0;
    set({ isAtLeft });
  },
  setIsAtRight: () => {
    const el = get().contentRef.current;
    if (!el) return;

    const { scrollLeft, clientWidth, scrollWidth } = el;
    const isAtRight = scrollLeft + clientWidth >= scrollWidth;
    set({ isAtRight });
  },
  setIsAtTop: () => {
    const el = get().contentRef.current;
    if (!el) return;

    const { scrollTop } = el;
    const isAtTop = scrollTop === 0;
    set({ isAtTop });
  },
  setIsAtBottom: () => {
    const el = get().contentRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight;
    set({ isAtBottom });
  },

  scrollToLeft: (forceToEnd: boolean = false) => {
    const el = get().contentRef.current;
    const headerRowEl = get().headerRowRef.current;
    if (!el || !headerRowEl) return;

    if (forceToEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      const offset = el.clientWidth - headerRowEl.clientWidth;
      el.scrollTo({ left: el.scrollLeft - offset, behavior: "smooth" });
    }
  },
  scrollToRight: (forceToEnd: boolean = false) => {
    const el = get().contentRef.current;
    const headerRowEl = get().headerRowRef.current;
    if (!el || !headerRowEl) return;

    if (forceToEnd) {
      el.scrollTo({ left: el.scrollLeft, behavior: "smooth" });
    } else {
      const offset = el.clientWidth - headerRowEl.clientWidth;
      el.scrollTo({ left: el.scrollLeft + offset, behavior: "smooth" });
    }
  },
  scrollToTop: () => {
    const el = get().contentRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "smooth" });
  },
  scrollToBottom: () => {
    const el = get().contentRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  },
}));
