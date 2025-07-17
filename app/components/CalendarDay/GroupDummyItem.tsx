"use client";

import { use, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { DummyGroupName } from "./GroupName";
import DropIndicatorGroup from "./Draggable/DropIndicatorGroup";
import GroupTrack from "./GroupTrack";
import { useGroupStore } from "@/app/stores/GroupStore";

export default function GroupDummyItem() {
  const appContext = use(AppContext);
  if (!appContext) {
    throw new Error("GroupDummyItem must be used within a AppProvider");
  }
  const { totalDays } = appContext;

  const dummyGroup = useGroupStore((s) => s.dummyGroup);

  useEffect(() => {
    console.log("GroupDummyItem rendered");
  });

  if (!dummyGroup) return null;

  return (
    <div className="app-GroupDummyItem w-full">
      <DropIndicatorGroup />
      <div className="flex h-[40px]">
        <div className="sticky left-0 z-[9] flex w-[200px] items-center">
          <DummyGroupName group={dummyGroup} />
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
