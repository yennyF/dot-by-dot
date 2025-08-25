"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CubeIcon,
} from "@radix-ui/react-icons";
import { genGroupedTasks, genUngroupedTasks } from "../repositories/data";
import { ReactNode, useRef, useState } from "react";
import { Group, Task } from "../repositories/types";
import { Checkbox } from "radix-ui";
import {
  notifyLoadError,
  notifyLoading,
  notifySuccessful,
} from "../components/Notification";
import { Id, toast } from "react-toastify";
import { redirect, RedirectType } from "next/navigation";
import { useAppStore } from "../stores/AppStore";
import AppHeader from "../components/AppHeader/AppHeader";

export default function Start() {
  const ungroupedTasks = useRef(genUngroupedTasks());
  const groupedTasks = useRef(genGroupedTasks());
  const [tasksSelected, setTasksSelected] = useState<Set<Task>>(new Set());

  const start = useAppStore((s) => s.start);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toastId = useRef<Id>(null);

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

  async function handleClickStart() {
    setIsLoading(true);

    if (toastId.current) toast.dismiss(toastId.current);
    toastId.current = notifyLoading();

    try {
      const groupsSelected = new Set<Group>();
      tasksSelected.forEach((task) => {
        const groupId = task.groupId;
        if (groupId) {
          const group = groupedTasks.current.find(
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
      redirect("/", RedirectType.replace);
    } catch {
      toast.dismiss(toastId.current);
      notifyLoadError();
    }

    setIsLoading(false);
  }

  return (
    <>
      <AppHeader />
      <main className="m-auto w-[88vw] max-w-[800]">
        <section className="mt-[100px]">
          <button
            className="flex items-center gap-2"
            onClick={() => redirect("/")}
          >
            <ArrowLeftIcon />
            Go back
          </button>

          <h1 className="mt-[50px] text-4xl font-bold">Getting started</h1>

          <p className="mt-[30px] leading-relaxed">
            Let’s set up your first tasks or habits. Select at least 3 to begin
            — you can update or reorganize them anytime.
          </p>

          <div className="mt-[30px] flex flex-col gap-2">
            {ungroupedTasks.current.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                selected={tasksSelected.has(task)}
                onCheckedChange={() => handleCheckedChange(task)}
              />
            ))}
          </div>

          <p className="mt-[30px] leading-relaxed">
            Use groups to stay organized. You can create a groups — like folders
            for your habits.
          </p>

          <div className="mt-[30px] flex flex-wrap gap-10">
            {groupedTasks.current.map(([group, tasks]) => (
              <GroupItem key={group.id} group={group}>
                <div className="flex flex-col items-start gap-2">
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      selected={tasksSelected.has(task) || false}
                      onCheckedChange={() => handleCheckedChange(task)}
                    />
                  ))}
                </div>
              </GroupItem>
            ))}
          </div>

          <div className="mt-[50px] flex flex-col items-center justify-center">
            <button
              className="button-accent mt-2 flex items-center gap-2"
              disabled={isLoading || tasksSelected.size < 3}
              onClick={handleClickStart}
            >
              <span>Let&apos;s begin </span>
              <ArrowRightIcon />
            </button>
          </div>
        </section>
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
    <div className="checkbox">
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
    </div>
  );
}
