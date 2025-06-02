"use client";

import { DragEvent, use, useState } from "react";
import { AppContext } from "../AppContext";
import HeaderToolbar from "./HeaderToolbar";

export default function Header() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("Header must be used within a AppProvider");
  }
  const { habits, moveHabit } = appContext;

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedIndex(index);
  };

  const handleDragEnd = (e: DragEvent) => {
    e.preventDefault();
    setDraggedIndex(null);
    setDraggedOverIndex(null);
  };

  const handleDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    setDraggedOverIndex(index);
  };

  const handleDrop = (e: DragEvent, targetIndex: number) => {
    if (draggedIndex === null) return;
    moveHabit(draggedIndex, targetIndex);
  };

  return (
    <div className="calendar-header sticky top-0 w-fit">
      {habits?.map((habit, index) => (
        <HeaderToolbar
          key={habit.id}
          habit={habit}
          dragging={draggedIndex !== null}
        >
          <div
            className={`draggable ${draggedIndex === habit.id && "opacity-30"} ${draggedOverIndex === habit.id && "text-[var(--accent)]"} flex w-full`}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={(e) => handleDragEnd(e)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <p className="overflow-hidden text-ellipsis text-nowrap">
              {habit.name}
            </p>
          </div>
        </HeaderToolbar>
      ))}
    </div>
  );
}
