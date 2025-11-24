import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGroupStore } from "./groupStore";
import { Group } from "../types";

type DotLayoutType = "grid" | "horizontal";

type Store = {
  closedGroups: string[];
  isGroupOpen: (groupId: string) => boolean;
  toggleGroup: (groupId: string) => void;
  closeAllGroups: () => void;
  openAllGroups: () => void;

  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  dotLayout: DotLayoutType;
  setDotLayout: (dotLayout: DotLayoutType) => void;

  selectedGroup: Group | undefined;
  setSelectedGroup: (group: Group | undefined) => void;
};

export const useUIStore = create<Store>()(
  persist(
    (set, get) => ({
      closedGroups: [],

      isGroupOpen: (groupId: string) => {
        return !get().closedGroups.includes(groupId);
      },

      toggleGroup: (groupId: string) => {
        set((s) => {
          const isCollapsed = s.closedGroups.includes(groupId);
          return {
            closedGroups: isCollapsed
              ? s.closedGroups.filter((id) => id !== groupId)
              : [...s.closedGroups, groupId],
          };
        });
      },

      closeAllGroups: () => {
        const groups = useGroupStore.getState().groups;
        set({ closedGroups: groups.map((g) => g.id) });
      },

      openAllGroups: () => {
        set({ closedGroups: [] });
      },

      isSidebarOpen: false,

      toggleSidebar: () => {
        set(({ isSidebarOpen }) => {
          return { isSidebarOpen: !isSidebarOpen };
        });
      },

      dotLayout: "grid",

      setDotLayout: (dotLayout: DotLayoutType) => {
        set({ dotLayout });
      },

      selectedGroup: undefined,

      setSelectedGroup: (selectedGroup: Group | undefined) => {
        set({ selectedGroup });
      },
    }),
    {
      name: "ui-storage",
    }
  )
);
