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

const Button = styled.button<{ $active?: boolean }>`
  animation: ${(props) => (props.$active ? pulseIn : pulseOut)} 0.3s;
`;

export default function TickedButton({
  active,
  onClick,
  ...props
}: { active: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  useEffect(() => {
    if (isAnimating) {
      setTimeout(function () {
        setIsAnimating(false);
      }, 500);
    }
  }, [isAnimating]);

  return (
    <Button
      $active={active}
      {...props}
      className={`h-4 w-4 rounded-full ${active ? "bg-[var(--color-red)]" : "bg-[var(--color-grey)]"} transition-all`}
      onClick={(e) => {
        setIsAnimating((isAnimating) => !isAnimating);
        onClick?.(e);
      }}
    ></Button>
  );
}
