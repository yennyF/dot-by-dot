"use client";

import React, { use, useEffect, useMemo } from "react";
import { AppContext } from "../../AppContext";
import TrackTask from "./TrackTask";
import TaskColumn from "./TaskColumn";
import { RowSpacingIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Collapsible } from "radix-ui";
import GroupName from "./GroupName";
import { Group } from "@/app/repositories/types";

export default function GroupTask({ group }: { group: Group }) {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("CalendarList must be used within a AppProvider");
  }
  const { tasks, totalDays } = appContext;

  const [open, setOpen] = React.useState(true);

  useEffect(() => {
    console.log("GroupTask re-render");
  });

  const filteredTask = useMemo(
    () => (tasks ? tasks.filter((task) => task.groupId === group.id) : []),
    [tasks, group.id]
  );

  if (!tasks || tasks.length === 0) {
    return;
  }

  return (
    <Collapsible.Root className="" open={open} onOpenChange={setOpen}>
      <div className="sticky left-0 flex h-[50px] w-[calc(100vw-320px-100px)] items-center justify-between rounded-md px-3">
        <GroupName group={group} />
        <Collapsible.Trigger asChild>
          <button className="button-icon">
            {open ? <Cross1Icon /> : <RowSpacingIcon />}
          </button>
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content className="flex w-fit">
        <TaskColumn tasks={filteredTask} />
        <div className="sticky left-[200px] flex flex-col">
          {filteredTask.map((task) => (
            <div className="calendar-row flex" key={task.id}>
              {totalDays.map((date) => (
                <TrackTask
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
