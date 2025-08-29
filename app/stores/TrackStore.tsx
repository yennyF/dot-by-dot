import { create } from "zustand";
import { LocaleDateString, Track } from "../repositories/types";
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
  subMonths,
} from "date-fns";
import { midnightUTC, midnightUTCstring } from "../util";
import { toast } from "react-toastify";
import { supabase } from "../repositories/db";

export type DayType = Date;
export type MonthType = [Date, DayType[]];
export type YearType = [Date, MonthType[]];

type State = {
  // Store date strings for reliable value-based Set comparison
  tasksByDate: Record<LocaleDateString, Set<string>> | undefined;
  unlock: boolean;

  startDate: Date;
  endDate: Date;
  totalDate: YearType[];
};

type Action = {
  setUnlock: (unlock: boolean) => void;
  destroyTracks: () => void;
  initTracks: () => Promise<void>;
  loadMorePrevTracks: () => Promise<void>;

  addTrack: (date: Date, taskId: string) => void;
  deleteTrack: (date: Date, taskId: string) => void;
  deleteAllTrack: () => Promise<void>;
};

export const useTrackStore = create<State & Action>((set, get) => ({
  unlock: true,
  setUnlock: (unlock: boolean) => {
    set(() => ({ unlock }));
  },

  tasksByDate: undefined,
  startDate: subMonths(startOfMonth(new Date()), 3),
  endDate: new Date(),
  totalDate: [],

  destroyTracks: async () => {
    set(() => ({
      unlock: false,
      asksByDate: undefined,
    }));
  },
  initTracks: async () => {
    const startDate = get().startDate;
    const endDate = get().endDate;
    const totalDate = getTotalDate(startDate, endDate);
    const tasksByDate: Record<LocaleDateString, Set<string>> = {};

    try {
      const { data, error } = await supabase
        .from("task_logs")
        .select("date, task_id")
        .gte("date", midnightUTCstring(startDate))
        .lte("date", midnightUTCstring(endDate));
      if (error) throw error;

      if (data) {
        apiToTaskLogArray(data).forEach((track) => {
          const dateString = track.date.toLocaleDateString();
          (tasksByDate[dateString] ??= new Set()).add(track.taskId);
        });
      }

      set(() => ({ tasksByDate, totalDate }));
    } catch (error) {
      console.error("Error initialing tracks:", error);
      throw error;
    }
  },
  loadMorePrevTracks: async () => {
    const startDate = subMonths(get().startDate, 1);
    const endDate = get().endDate;
    const totalDate = getTotalDate(startDate, endDate);
    const tasksByDate = { ...get().tasksByDate };
    const tastId = notifyLoading();

    try {
      const { data, error } = await supabase
        .from("task_logs")
        .select("date, task_id")
        .gte("created_at", midnightUTC(startDate))
        .lte("created_at", midnightUTC(endDate));
      if (error) throw error;

      if (data) {
        apiToTaskLogArray(data).forEach((track) => {
          const dateString = track.date.toLocaleDateString();
          (tasksByDate[dateString] ??= new Set()).add(track.taskId);
        });
      }

      // console.log(await timeoutPromise(2000));

      set(() => ({ tasksByDate, startDate, totalDate }));

      toast.dismiss(tastId);
    } catch (error) {
      console.error("Error loading more tracks:", error);
      toast.dismiss(tastId);
      notifyLoadError();
    }
  },

  addTrack: async (date: Date, taskId: string) => {
    const dateString = midnightUTCstring(date);
    date = midnightUTC(date);

    set((state) => {
      const tasksByDate = { ...state.tasksByDate };
      tasksByDate[dateString] = new Set(tasksByDate[dateString]);
      tasksByDate[dateString].add(taskId);
      return { tasksByDate };
    });

    try {
      const { error } = await supabase
        .from("task_logs")
        .insert(taskLogToApi({ taskId, date }));
      if (error) throw error;
    } catch (error) {
      console.error("Error checking task:", error);
      notifyCreateError();
    }
  },
  deleteTrack: async (date: Date, taskId: string) => {
    const dateString = midnightUTCstring(date);

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
      console.error("Error checking task:", error);
      notifyDeleteError();
    }
  },
  deleteAllTrack: async () => {
    try {
      get().destroyTracks();
      const { error } = await supabase.from("task_logs").delete();
      if (error) throw error;
    } catch (error) {
      console.error("Error cleaning history:", error);
      throw error;
    }
  },
}));

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function apiToTaskLogArray(data: any[]): Track[] {
  return data.map((t) => apiToTaskLog(t));
}

export function taskLogsToApiArray(track: Track[]) {
  return track.map((t) => taskLogToApi(t));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function apiToTaskLog(data: any): Track {
  return {
    date: new Date(data.date),
    taskId: data.task_id,
  };
}

export function taskLogToApi(track: Track) {
  return {
    date: track.date,
    task_id: track.taskId,
  };
}
