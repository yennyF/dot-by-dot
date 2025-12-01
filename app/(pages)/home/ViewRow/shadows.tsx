interface ShadowProps {
  className?: string;
}

export function ShadowLeft({ className }: ShadowProps) {
  return (
    <div
      className={`"shadow-left sticky left-0 z-10 w-[15px] shrink-0 bg-gradient-to-l from-transparent to-[var(--background)] ${className}`}
    />
  );
}

export function ShadowRight({ className }: ShadowProps) {
  return (
    <div
      className={`shadow-right sticky right-[var(--width-name)] w-[15px] shrink-0 bg-gradient-to-r from-transparent to-[var(--background)] ${className}`}
    />
  );
}

export function ShadowTop({ className }: ShadowProps) {
  return (
    <div
      className={`shadow-top h-[15px] w-full bg-gradient-to-t from-transparent to-[var(--background)] ${className}`}
    ></div>
  );
}

export function ShadowBottom({ className }: ShadowProps) {
  return (
    <div
      className={`shadow-bottom sticky bottom-0 left-0 z-10 h-[15px] w-full bg-gradient-to-b from-transparent to-[var(--background)] ${className}`}
    />
  );
}
