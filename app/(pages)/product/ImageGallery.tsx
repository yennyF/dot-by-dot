import clsx from "clsx";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  use,
  useState,
} from "react";

const Context = createContext<{
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
}>({
  active: 0,
  setActive: (() => {}) as Dispatch<SetStateAction<number>>,
});

function Root({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);

  return (
    <Context.Provider value={{ active, setActive }}>
      {children}
    </Context.Provider>
  );
}

function Content({ children }: { children: ReactNode }) {
  const active = use(Context).active;

  return (
    <div className="relative m-auto w-[full] max-w-[1200px] shrink-0 overflow-hidden">
      <div
        className={clsx("size-full transition-transform duration-500")}
        style={{
          aspectRatio: "16 / 9",
          transform: `translateX(-${active * 100}%)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Button({ value, children }: { value: number; children: ReactNode }) {
  const active = use(Context).active;
  const setActive = use(Context).setActive;

  return (
    <button
      className="flex items-center justify-center data-[state=active]:opacity-100 data-[state=inactive]:opacity-50"
      data-state={active === value ? "active" : "inactive"}
      onClick={() => setActive(value)}
    >
      {children}
    </button>
  );
}

function Item({ value, children }: { value: number; children: ReactNode }) {
  return (
    <div
      className="absolute size-full"
      style={{ transform: `translateX(${value * 100}%)` }}
    >
      {children}
    </div>
  );
}

const ImageGallery = { Root, Content, Button, Item };
export default ImageGallery;
