"use client";

import { Fragment, RefObject, useEffect } from "react";
import SortableContainer from "../SortableContainer/SortableContainer";
import { LinkReceptor } from "@/app/components/Scroll";
import { useGroupStore } from "@/app/stores/GroupStore";
import DropIndicatorGroup from "../SortableContainer/DropIndicatorGroup";
import GroupRow from "./GroupRow";
import TaskList from "./TaskList";

interface CalendarDayProps {
  ref: RefObject<HTMLDivElement | null>;
}

export default function HeaderSide({ ref }: CalendarDayProps) {
  const dummyGroup = useGroupStore((s) => s.dummyGroup);
  const groups = useGroupStore((s) => s.groups);

  useEffect(() => {
    console.log("HeaderSide rendered");
  });

  return (
    <SortableContainer
      scrollRef={ref}
      className="sticky left-0 z-10 flex w-name shrink-0 flex-col gap-2 bg-[var(--background)]"
    >
      <div>
        <LinkReceptor id="create-task" />
        <TaskList groupId={null} />
        <LinkReceptor id="create-group"></LinkReceptor>
      </div>
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
    </SortableContainer>
  );
}
