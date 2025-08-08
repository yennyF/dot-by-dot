import clsx from "clsx";

interface ShadowProps {
  className?: string;
}

export function ShadowLeft({ className }: ShadowProps) {
  return (
    <div
      className={clsx(
        "shadow-left left-name sticky z-10 w-[15px] shrink-0 bg-gradient-to-l from-transparent to-[var(--background)]",
        className
      )}
    />
  );
}

export function ShadowRight({ className }: ShadowProps) {
  return (
    <div
      className={clsx(
        "shadow-right sticky right-0 w-[15px] shrink-0 bg-gradient-to-r from-transparent to-[var(--background)]",
        className
      )}
    />
  );
}

export function ShadowTop({ className }: ShadowProps) {
  return (
    <div
      className={clsx(
        "shadow-top h-[15px] w-full bg-gradient-to-t from-transparent to-[var(--background)]",
        className
      )}
    ></div>
  );
}

export function ShadowBottom({ className }: ShadowProps) {
  return (
    <div
      className={clsx(
        "shadow-bottom sticky bottom-0 left-0 z-10 h-[15px] w-full bg-gradient-to-b from-transparent to-[var(--background)]",
        className
      )}
    />
  );
}
