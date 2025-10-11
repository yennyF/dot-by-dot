import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
  collapsedGroups: string[];
  toggleCollapsedGroup: (id: string) => void;
  reset: () => void;
};

export const useUIStore = create<Store>()(
  persist(
    (set, get) => ({
      collapsedGroups: [],
      toggleCollapsedGroup: (id) => {
        const collapsedGroups = get().collapsedGroups;
        set({
          collapsedGroups: collapsedGroups.includes(id)
            ? collapsedGroups.filter((x) => x !== id)
            : [...collapsedGroups, id],
        });
      },
      reset: () => set({ collapsedGroups: [] }),
    }),
    {
      name: "ui-storage",
    }
  )
);
