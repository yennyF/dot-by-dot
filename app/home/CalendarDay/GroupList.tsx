"use client";

import { Fragment } from "react";
import { useGroupStore } from "@/app/stores/GroupStore";
import DropIndicatorGroup from "./Draggable/DropIndicatorGroup";
import GroupItem from "./GroupItem/GroupItem";
import { LinkReceptor } from "../../components/Scroll";

export default function GroupList() {
  const dummyGroup = useGroupStore((s) => s.dummyGroup);
  const groups = useGroupStore((s) => s.groups);

  return (
    <div className="app-GroupList grouped-items flex w-fit flex-col gap-2">
      <LinkReceptor id="create-group"></LinkReceptor>
      {dummyGroup && (
        <>
          <DropIndicatorGroup />
          <GroupItem group={dummyGroup} isDummy={true} />
        </>
      )}

      {groups && groups.length > 0 && (
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
    </div>
  );
}
