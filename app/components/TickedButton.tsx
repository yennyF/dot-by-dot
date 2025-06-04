import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const pulseIn = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.3);
  }
 
  100% {
    transform: scale(1);
  }
`;

const pulseOut = keyframes`
  0% {
    transform: scale(1);
  }
  
  50% {
    transform: scale(0.7);
  }

  100% {
    transform: scale(1);
  }
`;

const Button = styled.button`
  background-color: var(--grey);

  &.pulse-in {
    animation: ${pulseIn} 0.25s;
  }

  &.pulse-out {
    animation: ${pulseOut} 0.25s;
  }

  &.active {
    background-color: var(--accent);
  }

  &:hover:not(.active) {
    background-color: var(--accent-5);
  }
`;

interface TickedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
}

export default function TickedButton({
  active,
  onClick,
  className,
  ...props
}: TickedButtonProps) {
  const [isAnimating, setIsAnimating] = useState<boolean>();

  useEffect(() => {
    if (isAnimating === undefined) return;

    const timeout = setTimeout(function () {
      setIsAnimating(false);
    }, 500);

    return () => {
      clearTimeout(timeout);
      setIsAnimating(undefined);
    };
  }, [isAnimating]);

  const pulseClass =
    isAnimating === true ? (active ? "pulse-in" : "pulse-out") : null;

  return (
    <Button
      {...props}
      className={`${className} ${active === true ? "active" : ""} h-4 w-4 rounded-full ${pulseClass ?? ""}`}
      onClick={(e) => {
        setIsAnimating((isAnimating) => !isAnimating);
        onClick?.(e);
      }}
    ></Button>
  );
}
