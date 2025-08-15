"use client";

import { memo } from "react";
import { Group } from "@/app/repositories/types";
import GroupRowItem from "./GroupRowItem";
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

interface GroupRowWrapperProps {
  group: Group;
}

function GroupRowWrapper({ group }: GroupRowWrapperProps) {
  const startDate = useTrackStore((s) => s.startDate);
  const endDate = useTrackStore((s) => s.endDate);

  const totalYears = eachYearOfInterval({
    start: startDate,
    end: endDate,
  });

  return (
    <div className="flex h-row">
      {totalYears.map((date) => (
        <YearGroupRow
          key={date.toLocaleDateString()}
          date={date}
          group={group}
        />
      ))}
    </div>
  );
}

function YearGroupRow({ date, group }: { date: Date; group: Group }) {
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
        <MonthGroupRow
          key={date.toLocaleDateString()}
          date={date}
          group={group}
        />
      ))}
    </div>
  );
}

function MonthGroupRow({ date, group }: { date: Date; group: Group }) {
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
        <GroupRowItem
          key={date.toLocaleDateString()}
          date={date}
          group={group}
        />
      ))}
    </div>
  );
}

const GroupRow = memo(GroupRowWrapper);
export default GroupRow;
