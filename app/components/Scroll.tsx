import { ReactNode } from "react";

interface LinkProps {
  children: ReactNode;
  to: string;
  options?: ScrollIntoViewOptions;
}

export function Link({ to, children, options }: LinkProps) {
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

export function Element({
  id,
  children,
}: {
  id: string;
  children?: ReactNode;
}) {
  return <div id={id}>{children}</div>;
}
