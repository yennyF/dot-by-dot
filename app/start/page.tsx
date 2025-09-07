"use client";

import { ArrowRightIcon, CheckIcon, CubeIcon } from "@radix-ui/react-icons";
import { generateGroupedTasks, generateTasks } from "../utils/generateData";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Group, Task } from "../types";
import { Checkbox } from "radix-ui";
import {
  notifyLoadError,
  notifyLoading,
  notifySuccessful,
} from "../components/Notification";
import { Id, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import AppHeader from "../components/AppHeader";
import Loading from "../components/Loading/Loading";
import GoBackButton from "../components/GoBackButton";
import { useAppStore } from "../stores/appStore";

export default function StartPage() {
  const router = useRouter();

  const isDataEmpty = useAppStore((s) => s.isDataEmpty);

  useEffect(() => {
    if (isDataEmpty === false) {
      router.replace("/");
    }
  }, [isDataEmpty, router]);

  return isDataEmpty === true ? <Content /> : <Loading />;
}

function Content() {
  const router = useRouter();

  const [ungroupedTasks, setUngroupedTasks] = useState<Task[]>([]);
  const [groupedTasks, setGroupedTasks] = useState<[Group, Task[]][]>([]);
  const [tasksSelected, setTasksSelected] = useState<Set<Task>>(new Set());

  const start = useAppStore((s) => s.start);

  const [isLoading, setIsLoading] = useState(false);
  const toastId = useRef<Id>(null);

  useEffect(() => {
    setUngroupedTasks(generateTasks());
    setGroupedTasks(generateGroupedTasks());
  }, []);

  const handleCheckedChange = (task: Task) => {
    setTasksSelected((prev) => {
      const newTaskSet = new Set(prev);
      if (prev.has(task)) {
        newTaskSet.delete(task);
      } else {
        newTaskSet.add(task);
      }
      return newTaskSet;
    });
  };

  const handleClickStart = async () => {
    if (isLoading) return;
    setIsLoading(true);

    if (toastId.current) toast.dismiss(toastId.current);
    toastId.current = notifyLoading();

    try {
      const groupsSelected = new Set<Group>();
      tasksSelected.forEach((task) => {
        const groupId = task.groupId;
        if (groupId) {
          const group = groupedTasks.find(
            ([group]) => group.id === groupId
          )?.[0];

          if (group) groupsSelected.add(group);
        }
      });

      const tasks = Array.from(tasksSelected);
      const groups = Array.from(groupsSelected);

      await start(groups, tasks);
      toast.dismiss(toastId.current);
      notifySuccessful("Ready to start");
      router.replace("/");
    } catch {
      toast.dismiss(toastId.current);
      notifyLoadError();
    }

    setIsLoading(false);
  };

  return (
    <>
      <AppHeader />
      <main className="page-main flex flex-col gap-[50px]">
        <GoBackButton />

        <section>
          <h1 className="page-title-1">Getting started</h1>
          <p>
            Let’s set up your first habits. Select at least one to get started —
            you can always change them later.
          </p>
          <ul className="mt-[30px] flex flex-col gap-2">
            {ungroupedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                selected={tasksSelected.has(task)}
                onCheckedChange={() => handleCheckedChange(task)}
              />
            ))}
          </ul>
        </section>

        <section>
          <h2 className="page-title-2">Use groups to stay organized</h2>
          <p>You can create groups — like folders for your habits.</p>
          <div className="mt-[30px] flex flex-wrap gap-10">
            {groupedTasks.map(([group, tasks]) => (
              <GroupItem key={group.id} group={group}>
                <ul className="flex flex-col items-start gap-2">
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      selected={tasksSelected.has(task) || false}
                      onCheckedChange={() => handleCheckedChange(task)}
                    />
                  ))}
                </ul>
              </GroupItem>
            ))}
          </div>
        </section>

        <button
          className="button-accent m-auto"
          disabled={tasksSelected.size === 0}
          onClick={handleClickStart}
        >
          <span>Let&apos;s begin </span>
          <ArrowRightIcon />
        </button>
      </main>
    </>
  );
}

function GroupItem({ group, children }: { group: Group; children: ReactNode }) {
  return (
    <div className="w-[350px]">
      <div className="mb-2 flex items-center gap-2">
        <CubeIcon className="h-[12px] w-[12px] shrink-0" />
        <h3 className="text-sm font-bold">{group.name}</h3>
      </div>
      {children}
    </div>
  );
}

function TaskItem({
  task,
  selected,
  onCheckedChange,
}: {
  task: Task;
  selected: boolean;
  onCheckedChange: () => void;
}) {
  return (
    <li className="checkbox">
      <div className="flex h-[24px] items-center">
        <Checkbox.Root
          id={task.id}
          className="checkbox-box group/checkbox"
          onCheckedChange={onCheckedChange}
        >
          <Checkbox.Indicator>
            <CheckIcon />
          </Checkbox.Indicator>
          {!selected && (
            <CheckIcon className="checkbox-indicator-hover group-hover/checkbox:block" />
          )}
        </Checkbox.Root>
      </div>
      <label htmlFor={task.id} className="checkbox-label">
        {task.name}
      </label>
    </li>
  );
}
