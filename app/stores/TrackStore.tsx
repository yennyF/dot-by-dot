import { create } from "zustand";
import { LocaleDateString } from "../repositories/types";
import { db } from "../repositories/db";
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

export type DayType = Date;
export type MonthType = [Date, DayType[]];
export type YearType = [Date, MonthType[]];

type State = {
  // Store date strings for reliable value-based Set comparison
  tasksByDate: Record<LocaleDateString, Set<string>> | undefined;
  unlock: boolean;
  currentStreaks: Record<string, number>;

  startDate: Date;
  endDate: Date;
  totalDate: YearType[];
};

type Action = {
  setUnlock: (unlock: boolean) => void;
  destroyTracks: () => void;
  initTracks: () => Promise<void>;
  loadMorePrevTracks: () => Promise<void>;
  clearHistory: () => Promise<void>;

  updateCurrentStreak: (taskId: string) => void;
  getCurrentStreak: (taskId: string) => Promise<number>;

  addTrack: (date: Date, taskId: string) => void;
  addTracks: (date: Date, taskIds: string[]) => void;
  deleteTrack: (date: Date, taskId: string) => void;
  deleteTracks: (date: Date, taskIds: string[]) => void;
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
      await db.tracks
        .where("date")
        .between(midnightUTC(startDate), midnightUTC(endDate), true, true)
        .each((track) => {
          const dateString = track.date.toLocaleDateString();
          (tasksByDate[dateString] ??= new Set()).add(track.taskId);
        });

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
      await db.tracks
        .where("date")
        .between(midnightUTC(startDate), midnightUTC(endDate), true, false)
        .each((track) => {
          const dateString = track.date.toLocaleDateString();
          (tasksByDate[dateString] ??= new Set()).add(track.taskId);
        });

      // console.log(await timeoutPromise(2000));

      set(() => ({ tasksByDate, startDate, totalDate }));

      toast.dismiss(tastId);
    } catch (error) {
      console.error("Error loading more tracks:", error);
      toast.dismiss(tastId);
      notifyLoadError();
    }
  },
  clearHistory: async () => {
    try {
      get().destroyTracks();
      await db.tracks.clear();
    } catch (error) {
      console.error("Error cleaning history:", error);
      throw error;
    }
  },

  currentStreaks: {},
  updateCurrentStreak: async (taskId: string) => {
    const streak = await get().getCurrentStreak(taskId);

    set((s) => {
      const newCurrentStreak = { ...s.currentStreaks };
      newCurrentStreak[taskId] = streak;
      return { currentStreaks: newCurrentStreak };
    });
  },
  getCurrentStreak: async (taskId: string) => {
    const today = midnightUTC(new Date());

    const tracks = await db.tracks
      .where("taskId")
      .equals(taskId)
      .and((track) => track.date <= today)
      .reverse()
      .sortBy("date"); // sort by date descending

    let streak = 0;
    const expectedDate = today;

    for (const track of tracks) {
      const trackDate = new Date(track.date);

      if (trackDate.getTime() === expectedDate.getTime()) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
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
      await db.tracks.add({ taskId, date });
      get().updateCurrentStreak(taskId);
    } catch (error) {
      console.error("Error checking task:", error);
      notifyCreateError();
    }
  },
  addTracks: async (date: Date, taskIds) => {
    const dateString = midnightUTCstring(date);
    set((state) => {
      const tasksByDate = { ...state.tasksByDate };
      tasksByDate[dateString] = new Set(state.tasksByDate?.[dateString]);
      taskIds.forEach((taskId) => tasksByDate[dateString].add(taskId));
      return { tasksByDate };
    });

    try {
      date = midnightUTC(date);
      await db.tracks.bulkAdd(taskIds.map((taskId) => ({ taskId, date })));
    } catch (error) {
      console.error("Error checking tracks:", error);
      notifyCreateError();
    }
  },
  deleteTrack: async (date: Date, taskId: string) => {
    const dateString = midnightUTCstring(date);
    date = midnightUTC(date);

    set((state) => {
      if (!state.tasksByDate) return {};

      const tasksByDate = { ...state.tasksByDate };
      tasksByDate[dateString] = new Set(state.tasksByDate[dateString]);
      tasksByDate[dateString].delete(taskId);
      return { tasksByDate };
    });

    try {
      await db.tracks.delete([taskId, date]);
      get().updateCurrentStreak(taskId);
    } catch (error) {
      console.error("Error checking task:", error);
      notifyDeleteError();
    }
  },
  deleteTracks: async (date: Date, taskIds: string[]) => {
    const dateString = midnightUTCstring(date);
    date = midnightUTC(date);

    set((state) => {
      if (!state.tasksByDate) return {};

      const tasksByDate = { ...state.tasksByDate };
      tasksByDate[dateString] = new Set(state.tasksByDate?.[dateString]);
      taskIds.forEach((taskId) => tasksByDate[dateString].delete(taskId));
      return { tasksByDate };
    });

    try {
      await db.tracks.bulkDelete(taskIds.map((taskId) => [taskId, date]));
    } catch (error) {
      console.error("Error checking tracks:", error);
      notifyDeleteError();
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
