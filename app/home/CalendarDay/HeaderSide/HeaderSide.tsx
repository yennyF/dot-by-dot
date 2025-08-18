"use client";

import { Fragment, useEffect, useRef } from "react";
import SortableContainer from "../SortableContainer/SortableContainer";
import { useGroupStore } from "@/app/stores/GroupStore";
import DropIndicatorGroup from "../SortableContainer/DropIndicatorGroup";
import GroupRow from "./GroupRow";
import TaskList from "./TaskList";
import useOnScreen from "@/app/hooks/useOnScreen";
import { scrollStore } from "@/app/stores/scrollStore";

export default function HeaderSide() {
  const scrollRef = scrollStore((s) => s.calendarScrollRef);

  const dummyGroup = useGroupStore((s) => s.dummyGroup);
  const groups = useGroupStore((s) => s.groups);

  const topRef = useRef<HTMLDivElement>(null);
  const isTopRefVisible = useOnScreen(topRef);

  useEffect(() => {
    if (dummyGroup && !isTopRefVisible) {
      topRef.current?.scrollIntoView({ block: "center" });
    }
  }, [dummyGroup, isTopRefVisible]);

  return (
    <SortableContainer
      scrollRef={scrollRef}
      className="sticky left-0 z-10 w-name shrink-0 bg-[var(--background)]"
    >
      <TaskList groupId={null} />

      <div ref={topRef} />

      <div className="mt-5 flex flex-col gap-5">
        {dummyGroup && (
          <>
            <DropIndicatorGroup />
            <GroupRow group={dummyGroup} isDummy={true} />
          </>
        )}
        {groups?.map((group) => (
          <Fragment key={group.id}>
            <DropIndicatorGroup beforeId={group.id} />
            <div>
              <GroupRow group={group} />
              <TaskList groupId={group.id} />
            </div>
          </Fragment>
        ))}
        <DropIndicatorGroup />
      </div>
    </SortableContainer>
  );
}
