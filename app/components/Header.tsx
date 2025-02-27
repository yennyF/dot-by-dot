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
    <div
      className="sticky top-16 z-10 grid h-16 bg-[var(--background)]"
      style={{
        gridTemplateColumns: `100px 100px repeat(${habits.length}, 110px)`,
      }}
    >
      <div className="sticky left-0 bg-[var(--background)]"></div>
      <div className="sticky left-[100px] bg-[var(--background)]"></div>
      {habits.map((habit, index) => (
        <HeaderToolbar
          key={index}
          habit={habit}
          dragging={draggedIndex !== null}
        >
          <div
            className={`draggable ${draggedIndex === index && "opacity-30"} ${draggedOverIndex === index && "text-[var(--accent)]"} flex w-full items-center justify-center px-1`}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={(e) => handleDragEnd(e)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <p className="overflow-hidden text-ellipsis text-nowrap text-center">
              {habit}
            </p>
          </div>
        </HeaderToolbar>
      ))}
    </div>
  );
}
