"use client";

import { memo } from "react";
import { Group } from "@/app/types";
import GroupRowItem from "./GroupRowItem";
import { DayType, MonthType, useTaskLogStore } from "@/app/stores/taskLogStore";

interface GroupRowWrapperProps {
  group: Group;
}

function GroupRowWrapper({ group }: GroupRowWrapperProps) {
  const years = useTaskLogStore((s) => s.totalDate);

  return (
    <div className="app-GroupRow flex">
      {years.map(([, months], index) => (
        <YearItem key={index} months={months} group={group} />
      ))}
    </div>
  );
}

function YearItem({ months, group }: { months: MonthType[]; group: Group }) {
  return (
    <>
      {months.map(([, days], index) => (
        <MonthItem key={index} days={days} group={group} />
      ))}
    </>
  );
}

function MonthItem({ days, group }: { days: DayType[]; group: Group }) {
  return (
    <>
      {days.map((date, index) => (
        <GroupRowItem key={index} date={date} group={group} />
      ))}
    </>
  );
}

const GroupRow = memo(GroupRowWrapper);
export default GroupRow;
