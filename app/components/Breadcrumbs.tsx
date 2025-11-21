import clsx from "clsx";
import React from "react";

const BreadcrumbsContext = React.createContext(
  {} as { value: string | undefined }
);

export default function Breadcrumbs({
  children,
  separator = "/",
  value,
}: {
  children?: React.ReactNode;
  separator?: React.ReactNode;
  value?: string;
}) {
  const items = React.Children.toArray(children);

  return (
    <BreadcrumbsContext.Provider value={{ value }}>
      <div className="flex items-center gap-[10px] text-xl">
        {items.map((child, index) => (
          <React.Fragment key={index}>
            {child}
            {index < items.length - 1 && separator}
          </React.Fragment>
        ))}
      </div>
    </BreadcrumbsContext.Provider>
  );
}

interface BreadcrumbsItemProps extends React.ComponentProps<"button"> {
  value: string;
}

export function BreadcrumbsItem({
  children,
  className,
  value,
  ...props
}: BreadcrumbsItemProps) {
  const { value: selectedValue } = React.use(BreadcrumbsContext);
  const isActive = selectedValue === value;

  return (
    <button
      {...props}
      data-state={isActive ? "open" : "closed"}
      className={clsx(
        className,
        "text-xl",
        isActive
          ? "cursor-default font-bold"
          : "hover:underline hover:decoration-2 hover:underline-offset-4"
      )}
    >
      {children}
    </button>
  );
}
