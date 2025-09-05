import { supabase } from "../supabase/server";
import { create } from "zustand";
import {
  Group,
  Task,
  mapTaskRequestArray,
  mapTaskLogRequestArray,
  TaskLog,
} from "../types";
import { notifyDeleteError } from "../components/Notification";
import { useTaskStore } from "./taskStore";
import { useGroupStore } from "./groupStore";
import { useTaskLogStore } from "./taskLogStore";
import { genGroupedTasks, genTaskLogs, genUngroupedTasks } from "../utils/data";
import { v4 as uuidv4 } from "uuid";

type State = {
  isDataEmpty: boolean | undefined;
};

type Action = {
  init: () => Promise<void>;
  reset: () => Promise<void>;
  start: (
    groups: Group[],
    tasks: Task[],
    taskLogs?: TaskLog[]
  ) => Promise<void>;
  startMock: () => Promise<void>;
};

export const useAppStore = create<State & Action>((set, get) => {
  setDataEmpty();

  return {
    isDataEmpty: undefined,

    init: async () => {
      try {
        await Promise.all([
          useGroupStore.getState().fetchGroups(),
          useTaskStore.getState().fetchTasks(),
          useTaskLogStore.getState().fetchTaskLogs(),
        ]);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    reset: async () => {
      try {
        // TODO single trasaction
        await Promise.all([
          supabase.from("task_logs").delete().neq("task_id", uuidv4()),
          supabase.from("tasks").delete().neq("id", uuidv4()),
          supabase.from("groups").delete().neq("id", uuidv4()),
        ]);

        useTaskLogStore.getState().destroyTaskLogs();
        useTaskStore.getState().destroyTasks();
        useGroupStore.getState().destroyGroups();
      } catch (error) {
        console.error(error);
        notifyDeleteError();
      }
    },
    start: async (groups: Group[], tasks: Task[], taskLogs?: TaskLog[]) => {
      try {
        const { error: errorGroup } = await supabase
          .from("groups")
          .insert(groups);
        if (errorGroup) throw errorGroup;

        const { error: errorTasks } = await supabase
          .from("tasks")
          .insert(mapTaskRequestArray(tasks));
        if (errorTasks) throw errorTasks;

        if (taskLogs)
          await supabase
            .from("task_logs")
            .insert(mapTaskLogRequestArray(taskLogs));

        get().init();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    startMock: async () => {
      const groups: Group[] = [];
      const tasks: Task[] = genUngroupedTasks();
      genGroupedTasks().forEach(([group, _tasks]) => {
        groups.push(group);
        tasks.push(..._tasks);
      });

      const taskLogs = genTaskLogs(
        useTaskLogStore.getState().startDate,
        useTaskLogStore.getState().endDate,
        tasks
      );

      get().start(groups, tasks, taskLogs);
    },
  };
});

async function countTask() {
  const { count, error } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

async function countGroup() {
  const { count, error } = await supabase
    .from("groups")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

async function setDataEmpty() {
  if ((await countTask()) > 0) {
    useAppStore.setState({ isDataEmpty: false });
    return;
  }
  if ((await countGroup()) > 0) {
    useAppStore.setState({ isDataEmpty: false });
    return;
  }
  useAppStore.setState({ isDataEmpty: true });
}

useGroupStore.subscribe(
  (state) => state.groups,
  async () => {
    setDataEmpty();
  }
);

useTaskStore.subscribe(
  (state) => state.tasksByGroup,
  async () => {
    setDataEmpty();
  }
);
