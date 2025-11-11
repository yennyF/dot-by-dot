import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGroupStore } from "./groupStore";

type Store = {
  collapsedGroups: string[];
  toggleCollapsedGroup: (id: string) => void;
  collapseAllGroups: () => void;
  expandAllGroups: () => void;
};

export const useUIStore = create<Store>()(
  persist(
    (set, get) => ({
      collapsedGroups: [],
      toggleCollapsedGroup: (id: string) => {
        const collapsedGroups = get().collapsedGroups;
        set({
          collapsedGroups: collapsedGroups.includes(id)
            ? collapsedGroups.filter((x) => x !== id)
            : [...collapsedGroups, id],
        });
      },
      collapseAllGroups: () => {
        const groups = useGroupStore.getState().groups;
        set({ collapsedGroups: groups?.map((g) => g.id) || [] });
      },
      expandAllGroups: () => {
        set({ collapsedGroups: [] });
      },
    }),
    {
      name: "ui-storage",
    }
  )
);
