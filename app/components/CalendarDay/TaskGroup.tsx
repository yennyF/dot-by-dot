"use client";

import React, { use, useEffect } from "react";
import { AppContext } from "../../AppContext";
import TaskValue from "./TaskValue";
import TaskColumn from "./TaskColumn";
import {
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
  RowSpacingIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { useStore } from "@/app/Store";
import { Group } from "@/app/repositories";
import { Collapsible } from "radix-ui";
import { EachDayOfIntervalResult } from "date-fns";

export default function TaskGroup({
  group,
  totalDays,
}: {
  group: Group;
  totalDays: EachDayOfIntervalResult<
    {
      start: Date;
      end: Date;
    },
    undefined
  >;
}) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { tasks } = appContext;

  const [open, setOpen] = React.useState(true);

  const loadTaskGroup = useStore((s) => s.loadTaskGroup);

  useEffect(() => {
    loadTaskGroup();
  }, [loadTaskGroup]);

  if (!tasks || tasks.length === 0) {
    return;
  }

  const filteredTask = tasks.filter((task) => task.groupId === group.id);

  return (
    <Collapsible.Root className="" open={open} onOpenChange={setOpen}>
      <div className="sticky left-0 flex h-[50px] w-[calc(100vw-320px-100px)] items-center justify-between rounded-md px-3">
        <div>{group.name}</div>
        <div className="flex gap-1">
          <button className="button-icon">
            <PlusIcon />
          </button>
          <button className="button-icon">
            <Pencil1Icon />
          </button>
          <button className="button-icon">
            <TrashIcon />
          </button>
          <Collapsible.Trigger asChild>
            <button className="button-icon">
              {open ? <Cross1Icon /> : <RowSpacingIcon />}
            </button>
          </Collapsible.Trigger>
        </div>
      </div>
      <Collapsible.Content className="flex w-fit">
        <TaskColumn tasks={filteredTask} />
        <div className="sticky left-[200px] flex flex-col">
          {filteredTask.map((task) => (
            <div className="calendar-row flex" key={task.id}>
              {totalDays.map((date) => (
                <TaskValue
                  key={`${task.id}-${date.toLocaleDateString()}`}
                  className="flex h-10 w-[50px] items-center justify-center"
                  date={date}
                  task={task}
                />
              ))}
            </div>
          ))}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
