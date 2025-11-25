import clsx from "clsx";
import styles from "./styles.module.scss";

const week_name = ["S", "M", "T", "W", "T", "F", "S"];

export default function GridHeader() {
  return (
    <div
      className={clsx(
        styles.gridHeader,
        "mb-[15px] flex items-center gap-x-[30px]"
      )}
    >
      {week_name.map((name, index) => (
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
  );
}
