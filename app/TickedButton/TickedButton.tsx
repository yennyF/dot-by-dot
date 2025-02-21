import { useEffect, useState } from "react";
import styles from "./TickedButton.module.scss";

export default function TickedButton({
  active,
  onClick,
  ...props
}: { active: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (isAnimatingIn) {
      setTimeout(function () {
        setIsAnimatingIn(false);
      }, 500);
    }
  }, [isAnimatingIn]);

  useEffect(() => {
    if (isAnimatingOut) {
      setTimeout(function () {
        setIsAnimatingOut(false);
      }, 500);
    }
  }, [isAnimatingOut]);

  return (
    <button
      {...props}
      className={`h-4 w-4 rounded-full ${
        active ? "bg-[var(--color-red)]" : "bg-[var(--color-grey)]"
      } transition-all ${styles.button} ${
        isAnimatingIn ? styles.animateIn : ""
      } ${isAnimatingOut ? styles.animateOut : ""}`}
      onClick={(e) => {
        if (active) {
          setIsAnimatingOut(true);
        } else {
          setIsAnimatingIn(true);
        }
        onClick?.(e);
      }}
    ></button>
  );
}
