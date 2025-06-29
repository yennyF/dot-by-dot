"use client";

import { DragEvent, RefObject, use, useRef } from "react";
import { AppContext } from "../../AppContext";
import TaskName from "./TaskName";
import { Group, Task } from "@/app/repositories/types";
import { useDrop } from "./useDrop";

export default function TaskColumn({
  group,
  tasks,
}: {
  group: Group;
  tasks: Task[];
}) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { moveTask, updateTask } = appContext;

  const ref = useRef<HTMLDivElement>(null);

  const {
    getIndicators,
    clearHighlights,
    highlightIndicator,
    getNearestIndicator,
  } = useDrop(ref);

  const handleDrop = (e: DragEvent) => {
    clearHighlights();

    const indicators = getIndicators();
    const el = getNearestIndicator(e, indicators);
    if (!el) return;

    const beforeId = Number(el.element.dataset.beforeId);
    const taskId = Number(e.dataTransfer.getData("taskId"));

    updateTask(taskId, group.id);

    if (beforeId === -1) {
      moveTask(taskId, null);
    } else if (beforeId !== taskId) {
      moveTask(taskId, beforeId);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
  };

  const handleDragLeave = () => {
    clearHighlights();
  };

  // const dropIndicatorRefs = useRef<Record<number, HTMLDivElement | null>>({});

  return (
    <div
      ref={ref}
      className="sticky left-0 z-[9] flex w-[200px] flex-col bg-[var(--background)]"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {tasks.map((task) => (
        <div key={task.id} className="relative flex h-10">
          <DropIndicator
            beforeId={task.id}
            className="absolute top-0"
            // ref={(el) => {
            //   dropIndicatorRefs.current[task.id] = el;
            // }}
          />
          <TaskName task={task} />
        </div>
      ))}
      <DropIndicator
        beforeId={-1}
        // ref={(el) => {
        //   dropIndicatorRefs.current[-1] = el;
        // }}
      />
    </div>
  );
}

interface DropIndicatorProps {
  beforeId: number;
  className?: string;
  ref?: RefObject<HTMLInputElement>;
}

const DropIndicator = ({ beforeId, className, ref }: DropIndicatorProps) => {
  return (
    <div
      ref={ref}
      className={`${className} drop-indicator left-2 right-2 h-0.5 rounded bg-[var(--inverted)] opacity-0`}
      data-before-id={beforeId}
    />
  );
};
