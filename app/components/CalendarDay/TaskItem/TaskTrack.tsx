"use client";

import { addDays, isToday } from "date-fns";
import clsx from "clsx";
import { useTrackStore } from "@/app/stores/TrackStore";
import { midnightUTCstring, Task } from "@/app/repositories/types";
import { CheckIcon, LockClosedIcon } from "@radix-ui/react-icons";
import HoldButton from "./HoldButton";
import CircularProgressBar from "../../CircularProgressBar";
import { useState } from "react";

interface TaskTrackProps {
  date: Date;
  task: Task;
}

export default function TaskTrack({ date, task }: TaskTrackProps) {
  const addTrack = useTrackStore((s) => s.addTrack);
  const deleteTrack = useTrackStore((s) => s.deleteTrack);

  const isActive =
    useTrackStore((s) =>
      s.tasksByDate?.[midnightUTCstring(date)]?.has(task.id)
    ) ?? false;
  const isPrevActive =
    useTrackStore((s) =>
      s.tasksByDate?.[midnightUTCstring(addDays(date, -1))]?.has(task.id)
    ) ?? false;
  const isNextActive =
    useTrackStore((s) =>
      s.tasksByDate?.[midnightUTCstring(addDays(date, 1))]?.has(task.id)
    ) ?? false;

  const isTodayDate = isToday(date);

  const dotClassName = clsx(
    "h-4 w-4 transform rounded-full transition-transform duration-100",
    "hover:scale-110",
    "active:scale-90",
    isActive
      ? task.groupId
        ? "bg-[var(--accent)]"
        : "bg-[var(--green)]"
      : task.groupId
        ? "bg-[var(--gray)] hover:bg-[var(--accent-5)]"
        : "bg-[var(--gray)] hover:bg-[var(--green-5)]"
  );

  // useEffect(() => {
  //   console.log("TaskTrack re-rendered");
  // });

  const handleClick = () => {
    if (isActive) {
      deleteTrack(date, task.id);
    } else {
      addTrack(date, task.id);
    }
  };

  const handleMouseEnter = () => {
    const el = document.querySelector(`.app-TaskName[data-id="${task.id}"]`);
    el?.classList.add("highlight");
  };

  const handleMouseLeave = () => {
    const el = document.querySelector(`.app-TaskName[data-id="${task.id}"]`);
    el?.classList.remove("highlight");
  };

  return (
    <div
      className={clsx(
        "app-TaskTrack relative flex h-10 w-[50px] items-center justify-center",
        isTodayDate && "isToday"
      )}
    >
      {isPrevActive && isActive && (
        <div
          className={clsx(
            "absolute left-0 right-[50%] z-[-1] h-4 animate-fade-in opacity-0",
            task.groupId ? "bg-[var(--accent-4)]" : "bg-[var(--green-5)]"
          )}
        />
      )}

      {isNextActive && isActive && (
        <div
          className={clsx(
            "absolute left-[50%] right-0 z-[-1] h-4 animate-fade-in opacity-0",
            task.groupId ? "bg-[var(--accent-4)]" : "bg-[var(--green-5)]"
          )}
        />
      )}

      {isTodayDate ? (
        <button
          onClick={handleClick}
          className={dotClassName}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isActive && !task.groupId && <CheckIcon className="text-white" />}
        </button>
      ) : (
        <LockContent
          task={task}
          isActive={isActive}
          dotClassName={dotClassName}
          onFinalize={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </div>
  );
}

function LockContent({
  task,
  isActive,
  dotClassName,
  onFinalize,
  ...props
}: {
  task: Task;
  isActive: boolean;
  dotClassName: string;
  onFinalize: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [removeLock, setRemoveLock] = useState(false);

  return (
    <>
      <div className="progress-wrapper absolute">
        <CircularProgressBar
          barColor={
            isActive
              ? task.groupId
                ? "var(--accent-5)"
                : "var(--green-5)"
              : task.groupId
                ? "var(--accent)"
                : "var(--green)"
          }
          size={22}
          strokeWidth={5}
          progress={progress}
        />
      </div>

      <div className="group relative flex justify-center">
        <LockClosedIcon
          className={clsx(
            "absolute -top-full h-[11px] w-[11px] text-gray-600 opacity-0 transition-opacity",
            removeLock ? "opacity-0" : "group-hover:opacity-100"
          )}
        />

        <HoldButton
          {...props}
          className={dotClassName}
          onMouseUp={() => setRemoveLock(false)}
          onUpdate={setProgress}
          onFinalize={() => {
            setTimeout(() => {
              onFinalize();
              setRemoveLock(true);
            }, 200); // Hack to match progress bar animation with the callback
          }}
        >
          {isActive && !task.groupId && <CheckIcon className="text-white" />}
        </HoldButton>
      </div>
    </>
  );
}
