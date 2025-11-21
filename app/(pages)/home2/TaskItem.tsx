import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { toApiDate } from "@/app/types";
import { CheckIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { isToday, isWeekend } from "date-fns";

interface TaskItemProps {
  date: Date;
  taskId: string;
}

export default function TaskItem({ date, taskId }: TaskItemProps) {
  const isActive = useTaskLogStore(
    (s) => s.tasksByDate[toApiDate(date)]?.has(taskId) ?? false
  );

  const isTodayDate = isToday(date);
  const isWeekendDate = isWeekend(date);

  return (
    <div className="app-TaskRowItem relative flex h-row w-day items-center justify-center">
      <div
        data-task-id={taskId}
        data-date={date}
        data-active={isActive}
        className={clsx(
          "app-Dot group box-border flex size-[var(--dot-size)] items-center justify-center rounded-full transition-transform duration-100",
          "hover:scale-110 hover:border-[1px] hover:border-black hover:bg-[var(--accent-5)]",
          "active:scale-90",
          isActive
            ? "bg-[var(--accent)]"
            : isTodayDate
              ? "bg-[var(--background)]"
              : isWeekendDate
                ? "bg-[var(--gray-5)]"
                : "bg-[var(--gray-5)]",
          isTodayDate && "border-[1px] border-black"
        )}
      >
        <CheckIcon
          className={clsx(
            "size-3 text-black opacity-0",
            "group-hover:opacity-100",
            isTodayDate && isActive && "opacity-100"
          )}
        />
      </div>
    </div>
  );
}
