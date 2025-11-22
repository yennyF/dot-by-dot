"use client";

import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";

import Loading from "../../components/Loading/Loading";
import { notifyLoadError } from "../../components/Notification";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../stores/userStore";
import { supabase } from "@/app/supabase/server";
import { useGroupStore } from "@/app/stores/groupStore";
import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/taskStore";
import GroupItem from "./GroupItem";
import TaskItem from "./TaskItem";
import { Group } from "@/app/types";
import { CubeIcon } from "@radix-ui/react-icons";
import Breadcrumbs, { BreadcrumbsItem } from "@/app/components/Breadcrumbs";
import styles from "./dot.module.scss";
import useClickLog from "@/app/hooks/useClickLog";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const user = useUserStore((s) => s.user);

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      router.replace("/product");
      return;
    }

    try {
      (async () => {
        const { data, error } = await supabase.rpc("user_has_group_or_task");

        if (error) throw error;
        if (data === false) {
          router.replace("/start");
          return;
        }
      })();

      setLoading(false);
    } catch {
      notifyLoadError();
    }
  }, [user, router]);

  return loading ? <Loading /> : <Content />;
}

function Content() {
  const fetchGroups = useGroupStore((s) => s.fetchGroups);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const fetchTaskLogs = useTaskLogStore((s) => s.fetchTaskLogs);
  const totalDate = useTaskLogStore((s) => s.totalDate);

  const [selectedGroup, setSelectedGroup] = useState<Group>();

  useEffect(() => {
    try {
      Promise.all([fetchGroups(), fetchTasks()]);
    } catch {
      notifyLoadError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      fetchTaskLogs();
    } catch {
      notifyLoadError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalDate]);

  return (
    <>
      <AppHeader></AppHeader>
      <main className="mx-[100px] mt-[100px]">
        <div className="mt-[20px]">
          <Breadcrumbs value={selectedGroup?.id ?? "-1"}>
            <BreadcrumbsItem
              value={"-1"}
              onClick={() => setSelectedGroup(undefined)}
            >
              All groups
            </BreadcrumbsItem>
            {selectedGroup && (
              <BreadcrumbsItem
                value={selectedGroup.id}
                className="flex items-center gap-[10px]"
              >
                <CubeIcon className="size-[20px]" />
                <span>{selectedGroup.name}</span>
              </BreadcrumbsItem>
            )}
          </Breadcrumbs>
        </div>

        <div className="mt-[50px] flex flex-wrap gap-[60px]">
          {selectedGroup ? (
            <GroupDetail groupId={selectedGroup.id} />
          ) : (
            <GroupAll
              onSelect={(group) => {
                setSelectedGroup(group);
              }}
            />
          )}
        </div>
      </main>
    </>
  );
}

function GroupAll({ onSelect }: { onSelect: (group: Group) => void }) {
  const groups = useGroupStore((s) => s.groups);
  const tasks = useTaskStore((s) => s.tasksByGroup[UNGROUPED_KEY]) || [];

  return (
    <>
      {tasks.map((task) => (
        <div key={task.id} className="flex flex-col gap-[15px]">
          <div>{task.name}</div>
          <TaskGrid taskId={task.id} />
        </div>
      ))}
      {groups.map((group) => (
        <div key={group.id} className="flex flex-col gap-[15px]">
          <button
            className="flex items-center gap-2 overflow-hidden"
            onClick={() => {
              onSelect(group);
            }}
          >
            <CubeIcon className="size-[12px] shrink-0" />
            <span className="overflow-hidden text-ellipsis text-nowrap font-bold">
              {group.name}
            </span>
          </button>
          <GroupGrid groupId={group.id} />
        </div>
      ))}
    </>
  );
}

function GroupDetail({ groupId }: { groupId: string }) {
  const tasks =
    useTaskStore((s) => s.tasksByGroup[groupId ?? UNGROUPED_KEY]) || [];

  return (
    <>
      {tasks.map((task) => (
        <div key={task.id} className="flex flex-col gap-[15px]">
          <div>{task.name}</div>
          <TaskGrid taskId={task.id} />
        </div>
      ))}
    </>
  );
}

function TaskGrid({ taskId }: { taskId: string }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);
  const handleClick = useClickLog();

  return (
    <div className={styles.log} onClick={handleClick}>
      {totalDate.map(([, months]) =>
        months.map(([, days]) =>
          days.map((date) => (
            <TaskItem key={date.toDateString()} date={date} taskId={taskId} />
          ))
        )
      )}
    </div>
  );
}

function GroupGrid({ groupId }: { groupId: string }) {
  const totalDate = useTaskLogStore((s) => s.totalDate);

  return (
    <div className={styles.log}>
      {totalDate.map(([, months]) =>
        months.map(([, days]) =>
          days.map((date) => (
            <GroupItem
              key={date.toDateString()}
              date={date}
              groupId={groupId}
            />
          ))
        )
      )}
    </div>
  );
}
