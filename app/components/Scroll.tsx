import { ReactNode, useEffect } from "react";

interface LinkProps {
  children: ReactNode;
  to: string;
  options?: ScrollIntoViewOptions;
  autoScroll?: boolean;
}

export function Link({ to, children, options, autoScroll }: LinkProps) {
  useEffect(() => {
    if (!autoScroll) return;

    const el = document.getElementById(to);
    if (!el) return;

    // Ensure DOM is ready before scrolling
    const timeoutId = setTimeout(() => {
      el.scrollIntoView(options);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoScroll]);

  return (
    <div
      onClick={() => {
        const el = document.getElementById(to);
        if (!el) return;
        el.scrollIntoView(options);
      }}
    >
      {children}
    </div>
  );
}

interface ElementProps {
  id: string;
  children?: ReactNode;
}

export function Element({ id, children }: ElementProps) {
  return <div id={id}>{children}</div>;
}
