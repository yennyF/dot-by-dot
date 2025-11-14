import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGroupStore } from "./groupStore";

type Store = {
  collapsedGroups: string[];
  isGroupOpen: (groupId: string) => boolean;
  toggleCollapsedGroup: (groupId: string) => void;
  collapseAllGroups: () => void;
  expandAllGroups: () => void;
};

export const useUIStore = create<Store>()(
  persist(
    (set, get) => ({
      collapsedGroups: [],

      isGroupOpen: (groupId: string) => {
        return !get().collapsedGroups.includes(groupId);
      },

      toggleCollapsedGroup: (groupId: string) => {
        set((s) => {
          const isCollapsed = s.collapsedGroups.includes(groupId);
          return {
            collapsedGroups: isCollapsed
              ? s.collapsedGroups.filter((id) => id !== groupId)
              : [...s.collapsedGroups, groupId],
          };
        });
      },

      collapseAllGroups: () => {
        const groups = useGroupStore.getState().groups || [];
        set({ collapsedGroups: groups.map((g) => g.id) });
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
