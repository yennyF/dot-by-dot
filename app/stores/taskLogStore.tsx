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

export type DayType = Date;
export type MonthType = [Date, DayType[]];
export type YearType = [Date, MonthType[]];

type State = {
  // Store date strings for reliable value-based Set comparison
  tasksByDate: Record<string, Set<string>> | undefined;
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
};

const rangeDays = 29;

export const useTaskLogStore = create<State & Action>((set, get) => {
  const startDate = subDays(new Date(), rangeDays);
  const endDate = new Date();
  const totalDate = getTotalDate(startDate, endDate);

  return {
    destroyTaskLogs: async () => {
      set(() => ({
        tasksByDate: undefined,
        lock: false,
        startDate: subDays(startOfMonth(new Date()), rangeDays),
        endDate: new Date(),
        totalDate: [],
      }));
    },

    startDate,
    endDate,
    totalDate,

    tasksByDate: undefined,
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
      const totalDate = getTotalDate(startDate, endDate);
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

        set(() => ({ tasksByDate, startDate, totalDate }));

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
        if (!state.tasksByDate) return {};

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
  };
});

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
