"use client";

import { ArrowRightIcon, CheckIcon } from "@radix-ui/react-icons";
import { generateGroupedTasks, generateTasks } from "../../utils/generateData";
import { useEffect, useMemo, useState } from "react";
import {
  Group,
  mapGroupRequestArray,
  mapTaskRequestArray,
  Task,
} from "../../types";
import { Checkbox } from "radix-ui";
import {
  debounceNotifyLoading,
  notifyLoadError,
  notifySuccessful,
} from "../../components/Notification";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import AppHeader from "../../components/AppHeader";
import Loading from "../../components/Loading/Loading";
import { useUserStore } from "../../stores/userStore";
import { supabase } from "@/app/supabase/server";
import GroupName from "../home/dots/GroupName";

const toastId = "toast-start-loading";

export default function StartPage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const [loading, setLoading] = useState(true);

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
        if (data === true) {
          router.replace("/home");
          return;
        }

        setLoading(false);
      })();
    } catch {
      notifyLoadError();
    }
  }, [user, router]);

  return loading ? <Loading /> : <Content />;
}

function Content() {
  const router = useRouter();

  const ungroupedTasks: Task[] = useMemo(() => generateTasks(), []);
  const groupedTasks: [Group, Task[]][] = useMemo(
    () => generateGroupedTasks(),
    []
  );
  const [tasksSelected, setTasksSelected] = useState<Set<Task>>(new Set());

  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    const debouncedNotification = debounceNotifyLoading(toastId);

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

      const { error: errorGroup } = await supabase
        .from("groups")
        .insert(mapGroupRequestArray(groups));
      if (errorGroup) throw errorGroup;

      const { error: errorTasks } = await supabase
        .from("tasks")
        .insert(mapTaskRequestArray(tasks));
      if (errorTasks) throw errorTasks;

      debouncedNotification.cancel();
      toast.dismiss(toastId);
      notifySuccessful("It's ready. Have fun!");
      setIsLoading(false);

      router.replace("/home");
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      notifyLoadError();
      setIsLoading(false);
    }
  };

  return (
    <>
      <AppHeader />
      <main className="page-main flex flex-col gap-[50px]">
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
              <div key={group.id} className="w-[350px]">
                <GroupName className="mb-2">{group.name}</GroupName>
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
              </div>
            ))}
          </div>
        </section>

        <button
          className="button-accent m-auto"
          disabled={tasksSelected.size === 0 || isLoading}
          onClick={handleClickStart}
        >
          <span>Let&apos;s begin </span>
          <ArrowRightIcon />
        </button>
      </main>
    </>
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
