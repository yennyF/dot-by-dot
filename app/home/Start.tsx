"use client";

import { ArrowRightIcon, CheckIcon, CubeIcon } from "@radix-ui/react-icons";
import {
  genGroupedTasks,
  genTracks,
  genUngroupedTasks,
} from "../repositories/data";
import { ReactNode, useRef, useState } from "react";
import { Group, Task } from "../repositories/types";
import { db } from "../repositories/db";
import { Checkbox } from "radix-ui";
import {
  notifyLoadError,
  notifyLoading,
  notifySuccessful,
} from "../components/Notification";
import { Id, toast } from "react-toastify";
import { useTrackStore } from "../stores/TrackStore";
import AppHeader from "../components/AppHeader/AppHeader";

export default function Start() {
  const ungroupedTasks = useRef(genUngroupedTasks());
  const groupedTasks = useRef(genGroupedTasks());

  const [tasksSelected, setTasksSelected] = useState<Set<Task>>(new Set());

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

  async function start() {
    setIsLoading(true);

    if (toastId.current) toast.dismiss(toastId.current);
    toastId.current = notifyLoading();

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

    try {
      await db.tables.forEach((table) => table.clear());
      await db.groups.bulkAdd(Array.from(groupsSelected));
      await db.tasks.bulkAdd(Array.from(tasksSelected));
      toast.dismiss(toastId.current);
      notifySuccessful("Ready to start");
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId.current);
      notifyLoadError();
    }

    setIsLoading(false);
  }

  async function runDemo() {
    setIsLoading(true);

    if (toastId.current) toast.dismiss(toastId.current);
    toastId.current = notifyLoading();

    try {
      const groups: Group[] = [];
      const tasks: Task[] = genUngroupedTasks();

      genGroupedTasks().forEach(([group, _tasks]) => {
        groups.push(group);
        tasks.push(..._tasks);
      });

      const tracks = genTracks(
        useTrackStore.getState().startDate,
        useTrackStore.getState().endDate,
        tasks
      );

      await db.tables.forEach((table) => table.clear());
      await db.groups.bulkAdd(groups);
      await db.tasks.bulkAdd(tasks);
      await db.tracks.bulkAdd(tracks);
      toast.dismiss(toastId.current);
      notifySuccessful("Ready to start");
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId.current);
      notifyLoadError();
    }

    setIsLoading(true);
  }

  return (
    <>
      <AppHeader />
      <div className="flex w-screen justify-center">
        <div className="mb-[200px] max-w-[800px]">
          <h1 className="mt-[100px] text-4xl font-bold">Getting started</h1>

          <p className="mt-[50px]">
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

          <p className="mt-[30px]">
            Use groups to stay organized. You can create a group and add tasks
            inside it — like folders for your habits.
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

          <div className="mt-[50px] flex justify-center">
            <button
              className="button-accent mt-2 flex items-center gap-2"
              disabled={isLoading || tasksSelected.size < 3}
              onClick={start}
            >
              <span>Let&apos;s begin </span>
              <ArrowRightIcon />
            </button>
          </div>

          <div>
            <h3 className="mt-[100px] text-2xl">Want a quick preview?</h3>

            <p className="mt-[30px]">
              Try the demo mode to explore the app. You can reset your tasks
              anytime in Settings.
            </p>

            <div className="mt-[30px] flex justify-center">
              <button
                className="button-outline mt-2"
                disabled={isLoading}
                onClick={runDemo}
              >
                Run demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function GroupItem({ group, children }: { group: Group; children: ReactNode }) {
  return (
    <div className="w-[350px]">
      <div className="mb-2 flex items-center gap-2">
        <CubeIcon className="h-[12px] w-[12px] shrink-0" />
        <h3 className="font-bold">{group.name}</h3>
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
