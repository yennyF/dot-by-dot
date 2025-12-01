import { CubeIcon } from "@radix-ui/react-icons";
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
      className={clsx(styles.root, "w-[250px]", onClick && "cursor-pointer")}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function LabelGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full items-center justify-center gap-[10px]">
      <CubeIcon className="text-[var(--gray-9)]" />
      <span className="overflow-hidden text-ellipsis text-nowrap font-bold">
        {children}
      </span>
    </div>
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
              name === "S" ? "text-[var(--red)]" : "text-[var(--gray)]"
            )}
          >
            {name}
          </span>
        ))}
      </div>
      <div
        className="grid grid-cols-7 place-items-center justify-around gap-y-[20px]"
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
          "absolute text-xs",
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
  LabelGroup,
  LabelTask,
  Content,
  Item,
};
export default Grid;
