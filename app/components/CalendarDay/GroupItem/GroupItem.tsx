"use client";

import { Fragment, memo, useEffect } from "react";
import GroupName from "./GroupName";
import { Group } from "@/app/repositories/types";
import DropIndicatorTask from "../Draggable/DropIndicatorTask";
import { useTaskStore } from "@/app/stores/TaskStore";
import TaskItem from "../TaskItem/TaskItem";
import GroupTrack from "./GroupTrack";
import { useTrackStore } from "@/app/stores/TrackStore";

interface GroupItemWrapperProps {
  group: Group;
  isDummy?: boolean;
}

function GroupItemWrapper({ group, isDummy }: GroupItemWrapperProps) {
  const totalDays = useTrackStore((s) => s.totalDays);

  const dummyTask = useTaskStore((s) =>
    s.dummyTask && s.dummyTask.groupId === group.id ? s.dummyTask : null
  );
  const tasks = useTaskStore((s) => s.tasksByGroup?.[group.id]);

  useEffect(() => {
    console.log("GroupItem rendered", group.name);
  });

  return (
    <div className="app-GroupItem w-full">
      <div className="group/item flex h-[40px]">
        <GroupName group={group} isDummy={isDummy} />
        <div className="sticky left-[200px] flex">
          {totalDays.map((date) => (
            <GroupTrack
              key={date.toLocaleDateString()}
              date={date}
              tasks={tasks || []}
            />
          ))}
        </div>
      </div>

      {dummyTask && (
        <>
          <DropIndicatorTask groupId={group.id} beforeId={dummyTask.id} />
          <TaskItem task={dummyTask} isDummy={true} />
        </>
      )}

      {tasks?.map((task) => (
        <Fragment key={task.id}>
          <DropIndicatorTask
            groupId={task.groupId ?? null}
            beforeId={task.id}
          />
          <TaskItem task={task} />
        </Fragment>
      ))}
      <DropIndicatorTask groupId={group.id} />
    </div>
  );
}

const GroupItem = memo(GroupItemWrapper);
export default GroupItem;
