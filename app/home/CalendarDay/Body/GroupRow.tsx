"use client";

import { memo } from "react";
import { Group } from "@/app/repositories/types";
import GroupRowItem from "./GroupRowItem";
import { DayType, MonthType, useTrackStore } from "@/app/stores/TrackStore";

interface GroupRowWrapperProps {
  group: Group;
}

function GroupRowWrapper({ group }: GroupRowWrapperProps) {
  const years = useTrackStore((s) => s.totalDate);

  return (
    <div className="app-GroupRow flex h-row">
      {years.map(([, months], index) => (
        <YearItem key={index} months={months} group={group} />
      ))}
    </div>
  );
}

function YearItem({ months, group }: { months: MonthType[]; group: Group }) {
  return (
    <div className="year-item flex">
      {months.map(([, days], index) => (
        <MonthItem key={index} days={days} group={group} />
      ))}
    </div>
  );
}

function MonthItem({ days, group }: { days: DayType[]; group: Group }) {
  return (
    <div className="month-item flex">
      {days.map((date, index) => (
        <GroupRowItem key={index} date={date} group={group} />
      ))}
    </div>
  );
}

const GroupRow = memo(GroupRowWrapper);
export default GroupRow;
