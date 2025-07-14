"use client";

import { ReactNode, useRef, DragEvent } from "react";

export function DraggableScrollContainer({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleOnDrag = (e: DragEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollSpeed = 10; // px per frame
    const threshold = 10; // px from top/bottom

    const { top, bottom } = container.getBoundingClientRect();

    const y = e.clientY;

    let direction = 0;
    if (y - top < threshold) direction = -1;
    else if (bottom - y < threshold) direction = 1;

    if (direction !== 0) container.scrollTop += direction * scrollSpeed;
  };

  return (
    <div
      id="DraggableScrollContainer"
      className={className}
      ref={containerRef}
      onDrag={handleOnDrag}
    >
      {children}
    </div>
  );
}
