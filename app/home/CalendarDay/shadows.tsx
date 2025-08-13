import { RefObject } from "react";
import LoadMore from "./LoadMore";

interface ShadowProps {
  className?: string;
  scrollRef?: RefObject<HTMLDivElement | null>;
}

export function ShadowLeft({ className, scrollRef }: ShadowProps) {
  return (
    <>
      <div
        className={`"shadow-left sticky left-name z-10 w-[15px] shrink-0 bg-gradient-to-l from-transparent to-[var(--background)] ${className}`}
      />
      {scrollRef ? (
        <LoadMore scrollRef={scrollRef} />
      ) : (
        <div className="w-[30px]" />
      )}
    </>
  );
}

export function ShadowRight({ className }: ShadowProps) {
  return (
    <div
      className={`shadow-right sticky right-0 w-[15px] shrink-0 bg-gradient-to-r from-transparent to-[var(--background)] ${className}`}
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
    <>
      {/* <div className="sticky left-0 flex w-full justify-center">
        <button className="button-icon-sheer">
          <ChevronUpIcon />
        </button>
      </div> */}
      <div
        className={`shadow-bottom sticky bottom-0 left-0 z-10 h-[15px] w-full bg-gradient-to-b from-transparent to-[var(--background)] ${className}`}
      />
    </>
  );
}
