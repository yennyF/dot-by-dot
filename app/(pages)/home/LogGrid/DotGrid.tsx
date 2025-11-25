import { CubeIcon } from "@radix-ui/react-icons";
import styles from "./DotGrid.module.scss";
import clsx from "clsx";
import { useTaskLogStore } from "@/app/stores/taskLogStore";

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function Root({ children }: { children: React.ReactNode }) {
  return <div className="w-[250px]">{children}</div>;
}

export function LabelGroup({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      className="flex w-full items-center justify-center gap-[10px]"
      onClick={onClick}
    >
      <CubeIcon className="text-[var(--gray-9)]" />
      <span className="overflow-hidden text-ellipsis text-nowrap">
        {children}
      </span>
    </button>
  );
}

export function LabelTask({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full items-center justify-center">
      <span className="overflow-hidden text-ellipsis text-nowrap">
        {children}
      </span>
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
      <div
        className={clsx(
          styles.week,
          "my-[15px] flex items-center justify-around"
        )}
      >
        {WEEK_DAYS.map((name, index) => (
          <span
            key={index}
            className={clsx(
              "size-[var(--dot-size)] text-center text-[10px] font-bold",
              name === "S" ? "text-[var(--red)]" : "text-[var(--black)]"
            )}
          >
            {name}
          </span>
        ))}
      </div>
      <div
        className="grid grid-cols-7 justify-around gap-y-[20px]"
        onClick={onClick}
      >
        {paddingDays.map((day) => (
          <div key={day.toDateString()} className="size-[var(--dot-size)]" />
        ))}
        {children}
      </div>
    </div>
  );
}

export function Item({
  children,
  date,
}: {
  children: React.ReactNode;
  date: Date;
}) {
  return (
    <div className="relative flex items-center justify-center">
      <span
        className={clsx(
          styles.date,
          "absolute cursor-default text-[9px] text-[var(--gray-9)]"
        )}
      >
        {date.getDate()}
      </span>
      {children}
    </div>
  );
}

const DotGrid = {
  Root,
  LabelGroup,
  LabelTask,
  Content,
  Item,
};
export default DotGrid;
