import { create } from "zustand";
import {
  notifyCreateError,
  notifyDeleteError,
  notifyLoadError,
  notifyLoading,
} from "../components/Notification";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfMonth,
  endOfYear,
  isAfter,
  isBefore,
  startOfMonth,
  startOfYear,
  subDays,
} from "date-fns";
import { toast } from "react-toastify";
import { supabase } from "../supabase/server";
import { v4 as uuidv4 } from "uuid";
import {
  mapTaskLogResponseArray,
  mapTaskLogRequest,
  toApiDate,
} from "../types";
import { subscribeWithSelector } from "zustand/middleware";

export type DayType = Date;
export type MonthType = [Date, DayType[]];
export type YearType = [Date, MonthType[]];

type State = {
  // Store date strings for reliable value-based Set comparison
  tasksByDate: Record<string, Set<string>>;
  startDate: Date;
  endDate: Date;
  totalDate: YearType[];
};

type Action = {
  destroyTaskLogs: () => void;
  fetchTaskLogs: () => Promise<void>;
  fetchMoreTaskLogs: () => Promise<void>;
  insertTaskLog: (date: Date, taskId: string) => void;
  deleteTaskLog: (date: Date, taskId: string) => void;
  deleteAllTaskLog: () => Promise<void>;
  getTasksDone: (date: Date, taskIds: string[]) => string[];
};

const rangeDays = 29;

export const useTaskLogStore = create<State & Action>()(
  subscribeWithSelector((set, get) => {
    const today = new Date();
    const startDate = subDays(today, rangeDays);
    const endDate = today;
    const totalDate = getTotalDate(startDate, endDate);

    return {
      startDate,
      endDate,
      totalDate,
      tasksByDate: {},

      destroyTaskLogs: async () => {
        set(
          () =>
            ({
              tasksByDate: {},
              lock: false,
              startDate: subDays(startOfMonth(new Date()), rangeDays),
              endDate: new Date(),
              totalDate: [],
            }) as State
        );
      },

      fetchTaskLogs: async () => {
        const startDate = get().startDate;
        const endDate = get().endDate;
        const tasksByDate: Record<string, Set<string>> = {};

        try {
          const { data, error } = await supabase
            .from("task_logs")
            .select("date, task_id")
            .gte("date", toApiDate(startDate))
            .lte("date", toApiDate(endDate));
          if (error) throw error;

          if (data) {
            mapTaskLogResponseArray(data).forEach((taskLog) => {
              (tasksByDate[toApiDate(taskLog.date)] ??= new Set()).add(
                taskLog.taskId
              );
            });
          }

          set(() => ({ tasksByDate }));
        } catch (error) {
          console.error(error);
          throw error;
        }
      },

      fetchMoreTaskLogs: async () => {
        const startDate = subDays(get().startDate, rangeDays);
        const endDate = get().endDate;
        // const totalDate = getTotalDate(startDate, endDate);
        const tasksByDate = { ...get().tasksByDate };
        const tastId = notifyLoading();

        try {
          const { data, error } = await supabase
            .from("task_logs")
            .select("date, task_id")
            .gte("created_at", toApiDate(startDate))
            .lte("created_at", toApiDate(endDate));
          if (error) throw error;

          if (data) {
            mapTaskLogResponseArray(data).forEach((taskLog) => {
              (tasksByDate[toApiDate(taskLog.date)] ??= new Set()).add(
                taskLog.taskId
              );
            });
          }

          set(() => ({ tasksByDate, startDate }));

          toast.dismiss(tastId);
        } catch (error) {
          console.error(error);
          toast.dismiss(tastId);
          notifyLoadError();
        }
      },

      insertTaskLog: async (date: Date, taskId: string) => {
        const dateString = toApiDate(date);

        set((state) => {
          const tasksByDate = { ...state.tasksByDate };
          tasksByDate[dateString] = new Set(tasksByDate[dateString]);
          tasksByDate[dateString].add(taskId);
          return { tasksByDate };
        });

        try {
          const { error } = await supabase
            .from("task_logs")
            .insert(mapTaskLogRequest({ taskId, date }));
          if (error) throw error;
        } catch (error) {
          console.error(error);
          notifyCreateError();
        }
      },

      deleteTaskLog: async (date: Date, taskId: string) => {
        const dateString = toApiDate(date);

        set((state) => {
          const tasksByDate = { ...state.tasksByDate };
          tasksByDate[dateString] = new Set(state.tasksByDate[dateString]);
          tasksByDate[dateString].delete(taskId);
          return { tasksByDate };
        });

        try {
          const { error } = await supabase
            .from("task_logs")
            .delete()
            .eq("date", dateString)
            .eq("task_id", taskId);
          if (error) throw error;
        } catch (error) {
          console.error(error);
          notifyDeleteError();
        }
      },

      deleteAllTaskLog: async () => {
        try {
          set(() => ({ tasksByDate: {} }));
          const { error } = await supabase
            .from("task_logs")
            .delete()
            .neq("task_id", uuidv4());
          if (error) throw error;
        } catch (error) {
          console.error(error);
          throw error;
        }
      },

      getTasksDone: (date: Date, taskIds: string[]) => {
        const tasks = get().tasksByDate[toApiDate(date)];
        return tasks ? taskIds.filter((t) => tasks.has(t)) : [];
      },
    };
  })
);

useTaskLogStore.subscribe(
  (state) => state.startDate,
  (startDate) => {
    const totalDate = getTotalDate(
      startDate,
      useTaskLogStore.getState().endDate
    );
    useTaskLogStore.setState({ totalDate });
  }
);

useTaskLogStore.subscribe(
  (state) => state.endDate,
  (endDate) => {
    const totalDate = getTotalDate(
      useTaskLogStore.getState().startDate,
      endDate
    );
    useTaskLogStore.setState({ totalDate });
  }
);

function getTotalDate(startDate: Date, endDate: Date) {
  const totalYears = eachYearOfInterval({
    start: startDate,
    end: endDate,
  });

  const years: YearType[] = totalYears.map((date) => {
    const totalMonths = eachMonthOfInterval({
      start: isAfter(startOfYear(date), startDate)
        ? startOfYear(date)
        : startDate,
      end: isBefore(endOfYear(date), endDate) ? endOfYear(date) : endDate,
    });

    const months: MonthType[] = totalMonths.map((date) => {
      const totalDays = eachDayOfInterval({
        start: isAfter(startOfMonth(date), startDate)
          ? startOfMonth(date)
          : startDate,
        end: isBefore(endOfMonth(date), endDate) ? endOfMonth(date) : endDate,
      });
      return [date, totalDays];
    });

    return [date, months];
  });

  return years;
}
