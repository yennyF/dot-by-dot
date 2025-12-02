import styles from "./Grid.module.scss";
import clsx from "clsx";
import { useTaskLogStore } from "@/app/stores/taskLogStore";

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function Root({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      className={clsx(
        styles.root,
        "w-[var(--width-grid-view))] p-[20px]",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function Content({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  const paddingDays = useTaskLogStore((s) => s.paddingDays);

  return (
    <div className={styles.content}>
      <div className="my-[20px] flex items-center justify-around">
        {WEEK_DAYS.map((name, index) => (
          <span
            key={index}
            className={clsx(
              "size-[var(--size-dot)] text-center text-xs font-bold",
              name === "S"
                ? "text-[var(--color-name-weekend)]"
                : "text-[var(--black)]"
            )}
          >
            {name}
          </span>
        ))}
      </div>
      <div
        className="mt-[10px] grid grid-cols-7 place-items-center justify-around gap-y-[var(--gap-y-grid-view)]"
        onClick={onClick}
      >
        {paddingDays.map((day) => (
          <div key={day.toDateString()} className="size-[var(--size-dot)]" />
        ))}
        {children}
      </div>
    </div>
  );
}

export function Item({
  children,
  date,
  isActive,
  isGroup = false,
}: {
  children: React.ReactNode;
  date: Date;
  isActive: boolean;
  isGroup?: boolean;
}) {
  return (
    <div className="group relative flex w-fit items-center justify-center">
      {children}
      <span
        className={clsx(
          styles.date,
          "pointer-events-none absolute text-xs",
          !isGroup && "group-hover:hidden",
          isActive ? "text-white" : "text-[var(--black)]"
        )}
      >
        {date.getDate()}
      </span>
    </div>
  );
}

const Grid = {
  Root,
  Content,
  Item,
};
export default Grid;
