"use client";

import React, { use, useEffect, useMemo } from "react";
import { AppContext } from "../../AppContext";
import TrackTask from "./TrackTask";
import TaskColumn from "./TaskColumn";
import { RowSpacingIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Collapsible } from "radix-ui";
import GroupName from "./GroupName";
import { Group } from "@/app/repositories/types";
import TrackGroup from "./TrackGroup";

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
      <div className="sticky left-0 flex h-[40px] w-fit">
        <GroupName group={group} />
        <div className="sticky left-[200px] flex">
          {totalDays.map((date) => (
            <TrackGroup
              key={date.toLocaleDateString()}
              date={date}
              tasks={filteredTask}
            />
          ))}
        </div>
        {/* <Collapsible.Trigger asChild>
          <button className="button-icon">
            {open ? <Cross1Icon /> : <RowSpacingIcon />}
          </button>
        </Collapsible.Trigger> */}
      </div>
      <Collapsible.Content className="flex w-fit">
        <TaskColumn group={group} tasks={filteredTask} />
        <div className="sticky left-[200px] flex flex-col">
          {filteredTask.map((task) => (
            <div className="calendar-row flex" key={task.id}>
              {totalDays.map((date) => (
                <TrackTask
                  key={date.toLocaleDateString()}
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
