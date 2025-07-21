"use client";

import React, { Fragment, useEffect } from "react";
import Ungroup from "./Ungroup";
import { useGroupStore } from "@/app/stores/GroupStore";
import GroupItemDummy from "./GroupItemDummy";
import DropIndicatorGroup from "../Draggable/DropIndicatorGroup";
import { Element } from "@/app/components/Scroll";
import MemoizedGroupItem from "./GroupItem";

export default function CalendarBody() {
  const groups = useGroupStore((s) => s.groups);

  useEffect(() => {
    console.log("CalendarBody rendered");
  });

  return (
    <div className="flex w-fit flex-col gap-2">
      <Ungroup />

      <Element id="create-group">
        <GroupItemDummy />
      </Element>

      {groups && groups.length && (
        <>
          {groups.map((group) => (
            <Fragment key={group.id}>
              <DropIndicatorGroup beforeId={group.id} />
              <MemoizedGroupItem group={group} />
            </Fragment>
          ))}
          <DropIndicatorGroup />
        </>
      )}
    </div>
  );
}

/* Shadows */
//<div className="shadow-background-top absolute left-0 top-[143px] z-10 h-[10px] w-full"></div>
//<div className="shadow-background-bottom absolute bottom-0 left-0 z-10 h-[10px] w-full"></div>
//<div className="shadow-background-left absolute left-[200px] top-0 z-10 h-full w-[10px]"></div>
//<div className="shadow-background-right absolute right-0 top-0 z-10 h-full w-[10px]"></div>
