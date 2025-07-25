"use client";

import { useEffect, useRef } from "react";

interface HoldButtonProps extends React.ComponentProps<"button"> {
  delay?: number;
  onEnd?: () => void;
  onFinalize?: () => void;
  onUpdate?: (progress: number) => void;
}

export default function HoldButton({
  children,
  delay = 1000,
  onEnd,
  onFinalize,
  onUpdate,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  ...props
}: HoldButtonProps) {
  const startTime = useRef<number>(null);
  const animationId = useRef<number>(null);

  useEffect(() => {
    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
    };
  }, []);

  const handleMouseDown = () => {
    const animate = (time: number) => {
      if (!startTime.current) startTime.current = time;
      const elapsed = time - startTime.current;
      const t = Math.min(elapsed / delay, 1);

      onUpdate?.(t);

      if (t < 1) {
        animationId.current = requestAnimationFrame(animate);
      } else if (t === 1) {
        onEnd?.();
        onFinalize?.();
      }
    };

    if (animationId.current) cancelAnimationFrame(animationId.current);
    onUpdate?.(0);
    startTime.current = null;
    animationId.current = requestAnimationFrame(animate);
  };

  const handleMouseUp = () => {
    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
      animationId.current = null;
    }
    onUpdate?.(0);
    onEnd?.();
  };

  const handleMouseLeave = () => {
    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
      animationId.current = null;
    }
    onUpdate?.(0);
    onEnd?.();
  };

  return (
    <button
      {...props}
      onMouseDown={(e) => {
        handleMouseDown();
        onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        handleMouseUp();
        onMouseUp?.(e);
      }}
      onMouseLeave={(e) => {
        handleMouseLeave();
        onMouseLeave?.(e);
      }}
    >
      {children}
    </button>
  );
}
