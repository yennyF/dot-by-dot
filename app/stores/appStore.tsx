import { supabase } from "../supabase/server";
import { create } from "zustand";
import {
  Group,
  Task,
  mapTaskRequestArray,
  mapTaskLogRequestArray,
  TaskLog,
  mapGroupRequestArray,
} from "../types";
import { notifyDeleteError } from "../components/Notification";
import { useTaskStore } from "./taskStore";
import { useGroupStore } from "./groupStore";
import { useTaskLogStore } from "./taskLogStore";
import {
  generateGroupedTasks,
  generateTaskLogs,
  generateTasks,
} from "../utils/generateData";
import { v4 as uuidv4 } from "uuid";

type State = {
  isEmpty: boolean | undefined;
};

type Action = {
  setIsEmpty: (isEmpty: boolean | undefined) => void;
  reset: () => Promise<void>;
  start: (
    groups: Group[],
    tasks: Task[],
    taskLogs?: TaskLog[]
  ) => Promise<void>;
  startMock: () => Promise<void>;
};

export const useAppStore = create<State & Action>((set, get) => {
  return {
    isEmpty: undefined,
    setIsEmpty: (isEmpty) => set({ isEmpty }),

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
          .insert(mapGroupRequestArray(groups));
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
      const tasks: Task[] = generateTasks();
      generateGroupedTasks().forEach(([group, _tasks]) => {
        groups.push(group);
        tasks.push(..._tasks);
      });

      const taskLogs = generateTaskLogs(
        useTaskLogStore.getState().startDate,
        useTaskLogStore.getState().endDate,
        tasks
      );

      get().start(groups, tasks, taskLogs);
    },
  };
});
