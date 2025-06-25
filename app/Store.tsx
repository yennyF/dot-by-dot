import { create } from "zustand";
import * as Repositories from "./repositories";
import { LocaleDateString } from "./repositories";

// Store date strings for reliable value-based Set comparison
export type TaskGroup = Record<string, Set<LocaleDateString>>;
export type DateGroup = Record<LocaleDateString, Set<number>>;

type Store = {
  taskGroup: TaskGroup | undefined;
  dateGroup: DateGroup | undefined;
  loadTaskGroup: () => Promise<void>;
  loadDateGroup: () => Promise<void>;
  setTaskChecked: (date: Date, taskId: number, checked: boolean) => void;
};

export const useStore = create<Store>((set) => ({
  tasks: undefined,
  taskGroup: undefined,
  dateGroup: undefined,
  loadTaskGroup: async () => {
    const tasks = await Repositories.getTasks();
    const entries = await Promise.all(
      tasks.map(async (task) => {
        const dates = await Repositories.getDatesByTask(task.id);
        return [task.id, dates] as [number, Set<LocaleDateString>];
      })
    );
    set(() => ({ taskGroup: Object.fromEntries(entries) }));
  },
  loadDateGroup: async () => {
    const tracks = await Repositories.getTracks();
    const entries = await Promise.all(
      tracks.map(async (track) => {
        const tasks = await Repositories.getTasksByDate(track.date);
        return [track.date.toLocaleDateString(), tasks] as [
          LocaleDateString,
          Set<number>,
        ];
      })
    );
    set(() => ({ dateGroup: Object.fromEntries(entries) }));
  },
  setTaskChecked: (date: Date, taskId: number, checked: boolean) => {
    set((state) => {
      const dateString = date.toLocaleDateString();

      const newTaskGroup = { ...state.taskGroup };
      newTaskGroup[taskId] = new Set(state.taskGroup?.[taskId]);
      const newDateGroup = { ...state.dateGroup };
      newDateGroup[dateString] = new Set(state.dateGroup?.[dateString]);

      if (checked) {
        newTaskGroup[taskId].add(date.toLocaleDateString());
        newDateGroup[dateString].add(taskId);
      } else {
        newTaskGroup[taskId].delete(date.toLocaleDateString());
        newDateGroup[dateString].delete(taskId);
      }
      return {
        taskGroup: newTaskGroup,
        dateGroup: newDateGroup,
      };
    });

    try {
      if (checked) {
        Repositories.addTrack(taskId, date);
      } else {
        Repositories.deleteTrack(taskId, date);
      }
    } catch {
      // TODO rollback and message
    }
  },
}));
