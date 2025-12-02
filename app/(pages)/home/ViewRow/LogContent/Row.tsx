import clsx from "clsx";

function Root({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div className="flex min-w-[150px]" onClick={onClick}>
      {children}
    </div>
  );
}

function Item({
  children,
  isActive,
  isNextActive,
  color,
}: {
  children: React.ReactNode;
  isActive: boolean;
  isNextActive: boolean;
  color: string;
}) {
  return (
    <div className="relative flex h-[var(--height-row)] w-[var(--width-col)] items-center justify-center">
      {isActive && isNextActive && (
        <div
          className={clsx(
            "nimate-fade-in absolute -right-1/2 left-1/2 -z-10 h-[var(--dot-size)]",
            color
          )}
          // style={{
          //   background: `linear-gradient(to right, ${colorStart}, ${colorEnd})`,
          // }}
        />
      )}
      {children}
    </div>
  );
}

const Row = {
  Root,
  Item,
};
export default Row;
