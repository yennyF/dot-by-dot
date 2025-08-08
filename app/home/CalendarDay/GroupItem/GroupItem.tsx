"use client";

import { memo, useEffect } from "react";
import GroupName from "./GroupName";
import { Group } from "@/app/repositories/types";
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
import TaskList from "../TaskList";

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
              group={group}
            />
          ))}
        </div>
      </div>

      <TaskList groupId={group.id} />
    </div>
  );
}

function YearGroupItem({ date, group }: { date: Date; group: Group }) {
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
          group={group}
        />
      ))}
    </div>
  );
}

function MonthGroupItem({ date, group }: { date: Date; group: Group }) {
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
        <GroupTrack key={date.toLocaleDateString()} date={date} group={group} />
      ))}
    </div>
  );
}

const GroupItem = memo(GroupItemWrapper);
export default GroupItem;
