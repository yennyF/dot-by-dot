import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGroupStore } from "./groupStore";

type HomeViewType = "grid" | "row" | "stats";

type Store = {
  closedGroups: string[];
  isGroupOpen: (groupId: string) => boolean;
  toggleGroup: (groupId: string) => void;
  closeAllGroups: () => void;
  openAllGroups: () => void;

  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  homeView: HomeViewType;
  setHomeView: (homeView: HomeViewType) => void;

  selectedGroup: string | null;
  setSelectedGroup: (group: string | null) => void;
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

      homeView: "grid",

      setHomeView: (homeView: HomeViewType) => {
        set({ homeView });
      },

      selectedGroup: null,

      setSelectedGroup: (selectedGroup: Store["selectedGroup"]) => {
        set({ selectedGroup });
      },
    }),
    {
      name: "ui-storage",
    }
  )
);
