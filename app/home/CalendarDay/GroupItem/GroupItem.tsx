"use client";

import { Fragment, memo, useEffect } from "react";
import GroupName from "./GroupName";
import { Group, Task } from "@/app/repositories/types";
import DropIndicatorTask from "../Draggable/DropIndicatorTask";
import { useTaskStore } from "@/app/stores/TaskStore";
import TaskItem from "../TaskItem/TaskItem";
import GroupTrack from "./GroupTrack";
import { useTrackStore } from "@/app/stores/TrackStore";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfMonth,
  endOfYear,
  isAfter,
  isBefore,
  startOfMonth,
  startOfYear,
} from "date-fns";

interface GroupItemWrapperProps {
  group: Group;
  isDummy?: boolean;
}

function GroupItemWrapper({ group, isDummy }: GroupItemWrapperProps) {
  const startDate = useTrackStore((s) => s.startDate);
  const endDate = useTrackStore((s) => s.endDate);

  const totalYears = eachYearOfInterval({
    start: startDate,
    end: endDate,
  });

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
        <div className="sticky flex">
          {totalYears.map((date) => (
            <YearGroupItem
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

function YearGroupItem({ date, tasks }: { date: Date; tasks: Task[] }) {
  const startDate = useTrackStore((s) => s.startDate);
  const endDate = useTrackStore((s) => s.endDate);

  const totalMonths = eachMonthOfInterval({
    start: isAfter(startOfYear(date), startDate)
      ? startOfYear(date)
      : startDate,
    end: isBefore(endOfYear(date), endDate) ? endOfYear(date) : endDate,
  });

  return (
    <div className="year-item flex">
      {totalMonths.map((date) => (
        <MonthGroupItem
          key={date.toLocaleDateString()}
          date={date}
          tasks={tasks}
        />
      ))}
    </div>
  );
}

function MonthGroupItem({ date, tasks }: { date: Date; tasks: Task[] }) {
  const startDate = useTrackStore((s) => s.startDate);
  const endDate = useTrackStore((s) => s.endDate);

  const totalDays = eachDayOfInterval({
    start: isAfter(startOfMonth(date), startDate)
      ? startOfMonth(date)
      : startDate,
    end: isBefore(endOfMonth(date), endDate) ? endOfMonth(date) : endDate,
  });

  return (
    <div className="month-item flex">
      {totalDays.map((date) => (
        <GroupTrack
          key={date.toLocaleDateString()}
          date={date}
          tasks={tasks || []}
        />
      ))}
    </div>
  );
}

const GroupItem = memo(GroupItemWrapper);
export default GroupItem;
