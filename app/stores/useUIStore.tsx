import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGroupStore } from "./groupStore";

type HomeViewType = "grid" | "row" | "stats";

type Store = {
  openGroups: string[];
  setOpenGroups: (openGroups: string[]) => void;
  openGroup: (group: string) => void;
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
      openGroups: [],

      setOpenGroups: (openGroups: string[]) => {
        set({ openGroups });
      },

      openGroup: (group: string) => {
        const { openGroups } = get();
        if (openGroups.includes(group)) return;
        set({ openGroups: [...openGroups, group] });
      },

      closeAllGroups: () => {
        const groups = useGroupStore.getState().groups;
        set({ openGroups: groups.map((g) => g.id) });
      },

      openAllGroups: () => {
        set({ openGroups: [] });
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
