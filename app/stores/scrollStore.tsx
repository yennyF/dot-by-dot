import { create } from "zustand";
import { createRef, RefObject } from "react";

type State = {
  todayRef: RefObject<HTMLDivElement | null>;
  calendarScrollRef: RefObject<HTMLDivElement | null>;
  todayEl: HTMLDivElement | null;
  isAtLeft: boolean;
  isAtRight: boolean;
  isAtBottom: boolean;
  isAtTop: boolean;
};

type Action = {
  setTodayEl: (todayEl: HTMLDivElement) => void;

  setIsAtLeft: () => void;
  setIsAtRight: () => void;
  setIsAtBottom: () => void;
  setIsAtTop: () => void;

  scrollToLeft: (offset?: number) => void;
  scrollToRight: (offset?: number) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
};

export const scrollStore = create<Action & State>((set, get) => ({
  todayRef: createRef<HTMLDivElement>(),
  calendarScrollRef: createRef<HTMLDivElement>(),
  todayEl: null,

  isAtLeft: false,
  isAtRight: false,
  isAtTop: false,
  isAtBottom: false,

  setTodayEl: (todayEl) => set({ todayEl }),

  setIsAtLeft: () => {
    const el = get().calendarScrollRef.current;
    if (!el) return;

    const { scrollLeft } = el;
    const isAtLeft = scrollLeft === 0;
    set({ isAtLeft });
  },
  setIsAtRight: () => {
    const el = get().calendarScrollRef.current;
    if (!el) return;

    const { scrollLeft, clientWidth, scrollWidth } = el;
    const isAtRight = scrollLeft + clientWidth >= scrollWidth;
    set({ isAtRight });
  },
  setIsAtTop: () => {
    const el = get().calendarScrollRef.current;
    if (!el) return;

    const { scrollTop } = el;
    const isAtTop = scrollTop === 0;
    set({ isAtTop });
  },
  setIsAtBottom: () => {
    const el = get().calendarScrollRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight;
    set({ isAtBottom });
  },

  scrollToLeft: (offset?: number) => {
    const el = get().calendarScrollRef.current;
    if (!el) return;
    if (offset) {
      el.scrollTo({ left: el.scrollLeft - offset, behavior: "smooth" });
    } else {
      el.scrollTo({ left: 0, behavior: "smooth" });
    }
  },
  scrollToRight: (offset?: number) => {
    const el = get().calendarScrollRef.current;
    if (!el) return;
    if (offset) {
      el.scrollTo({ left: el.scrollLeft + offset, behavior: "smooth" });
    } else {
      el.scrollTo({ left: el.scrollLeft, behavior: "smooth" });
    }
  },
  scrollToTop: () => {
    const el = get().calendarScrollRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "smooth" });
  },
  scrollToBottom: () => {
    const el = get().calendarScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  },
}));
