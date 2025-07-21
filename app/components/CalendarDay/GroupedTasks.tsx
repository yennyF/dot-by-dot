"use client";

import React, { Fragment, useEffect } from "react";
import { useGroupStore } from "@/app/stores/GroupStore";
import DropIndicatorGroup from "./Draggable/DropIndicatorGroup";
import GroupItem from "./GroupItem/GroupItem";
import { LinkReceptor } from "../Scroll";

export default function GroupedTasks() {
  const dummyGroup = useGroupStore((s) => s.dummyGroup);
  const groups = useGroupStore((s) => s.groups);

  useEffect(() => {
    console.log("CalendarBody rendered");
  });

  return (
    <>
      <LinkReceptor id="create-group"></LinkReceptor>
      {dummyGroup && (
        <>
          <DropIndicatorGroup />
          <GroupItem group={dummyGroup} isDummy={true} />
        </>
      )}

      {groups && groups.length && (
        <>
          {groups.map((group) => (
            <Fragment key={group.id}>
              <DropIndicatorGroup beforeId={group.id} />
              <GroupItem group={group} />
            </Fragment>
          ))}
          <DropIndicatorGroup />
        </>
      )}
    </>
  );
}
