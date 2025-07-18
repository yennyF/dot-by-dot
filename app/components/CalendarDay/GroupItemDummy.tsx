"use client";

import { use, useEffect } from "react";
import { AppContext } from "../../AppContext";
import GroupTrack from "./GroupTrack";
import { useGroupStore } from "@/app/stores/GroupStore";
import { GroupNameDummy } from "./GroupNameDummy";

export default function GroupItemDummy() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("GroupItemDummy must be used within a AppProvider");
  }
  const { totalDays } = appContext;

  const dummyGroup = useGroupStore((s) => s.dummyGroup);

  useEffect(() => {
    console.log("GroupItemDummy rendered");
  });

  if (!dummyGroup) return null;

  return (
    <div className="app-GroupItemDummy w-full">
      <div className="flex h-[40px]">
        <div className="sticky left-0 z-[9] flex w-[200px] items-center">
          <GroupNameDummy group={dummyGroup} />
        </div>
        <div className="sticky left-[200px] flex">
          {totalDays.map((date) => (
            <GroupTrack key={date.toDateString()} date={date} tasks={[]} />
          ))}
        </div>
      </div>
    </div>
  );
}
