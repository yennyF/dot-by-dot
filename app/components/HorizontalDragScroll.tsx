// HorizontalDragScroll.jsx
// Single-file React component (JSX) that provides mouse-drag & touch-drag horizontal scrolling.
// Built to be drop-in with Tailwind classes. Exports a default React component.

/*
Notes & tips:
- This component uses Pointer Events so it supports mouse, pen, and touch.
- The code prevents text selection while dragging and uses pointer capture so
  dragging is smooth even if the cursor leaves the element.
- If you want inertia (momentum) after releasing the drag, you can add
  a small JS-based fling animation using requestAnimationFrame and the
  last known velocity. I can add that on request.
*/

import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  MouseEvent,
  ReactNode,
  RefObject,
} from "react";
import { useScrollStore } from "../stores/scrollStore";

interface HorizontalDragScroll {
  children: ReactNode;
  className: string;
  ref: RefObject<HTMLDivElement | null>;
}

export default function HorizontalDragScroll({
  children,
  className,
  ref,
}: HorizontalDragScroll) {
  const setIsAtLeft = useScrollStore((s) => s.setIsAtLeft);
  const setIsAtRight = useScrollStore((s) => s.setIsAtRight);

  const localRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

  const isDraggingRef = useRef(false);
  const isMovedRef = useRef(false);

  const preStartXRef = useRef(0);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      // Only left mouse button or touch
      if (e.pointerType === "mouse" && e.button !== 0) return;

      const el = e.currentTarget as HTMLDivElement;

      isDraggingRef.current = true;
      isMovedRef.current = false;

      preStartXRef.current = e.clientX;
      startXRef.current = e.clientX;
      scrollLeftRef.current = el.scrollLeft;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;

      const el = e.currentTarget as HTMLDivElement;

      const predx = e.clientX - preStartXRef.current;
      if (Math.abs(predx) < 3) {
        startXRef.current = e.clientX;
        scrollLeftRef.current = el.scrollLeft;
        return;
      }

      if (!isMovedRef.current) {
        isMovedRef.current = true;
        // Capture pointer to continue receiving events even if cursor leaves
        el.setPointerCapture(e.pointerId);
        el.style.userSelect = "none"; // Prevent text selection
        el.style.cursor = "grabbing";
      }

      const dx = e.clientX - startXRef.current;
      el.scrollLeft = scrollLeftRef.current - dx;
    };

    const onPointerUpOrCancel = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      const el = e.currentTarget as HTMLDivElement;

      try {
        el.releasePointerCapture(e.pointerId);
      } catch {}
      el.style.userSelect = "";
      el.style.cursor = "";
    };

    const onScoll = () => {
      setIsAtLeft();
      setIsAtRight();
    };

    // Slightly better performance for rapid events like pointermove or mousemove.
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUpOrCancel);
    el.addEventListener("pointercancel", onPointerUpOrCancel);
    el.addEventListener("scroll", onScoll);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUpOrCancel);
      el.removeEventListener("pointercancel", onPointerUpOrCancel);
      el.removeEventListener("scroll", onScoll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prevent clicks firing when user dragged; we can intercept onClick on children if needed.
  const handleClickCapture = (e: MouseEvent) => {
    if (isMovedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      isMovedRef.current = false;
    }
  };

  return (
    <div
      ref={localRef}
      className={` ${className}`}
      // style={{ WebkitOverflowScrolling: "touch" }}
      onClickCapture={handleClickCapture}
    >
      {children}
    </div>
  );
}
