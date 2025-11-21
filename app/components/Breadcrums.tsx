import React from "react";

export default function Breadcrumbs({
  children,
  separator = "/",
}: {
  children?: React.ReactNode;
  separator?: React.ReactNode;
}) {
  const items = React.Children.toArray(children);

  return (
    <div className="flex items-center gap-[10px] text-xl">
      {items.map((child, index) => (
        <React.Fragment key={index}>
          {child}
          {index < items.length - 1 && separator}
        </React.Fragment>
      ))}
    </div>
  );
}
