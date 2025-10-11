import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
  collapsed: string[];
  toggleCollapse: (id: string) => void;
  reset: () => void;
};

export const useCollapsedStore = create<Store>()(
  persist(
    (set, get) => ({
      collapsed: [],
      toggleCollapse: (id) => {
        const collapsed = get().collapsed;
        set({
          collapsed: collapsed.includes(id)
            ? collapsed.filter((x) => x !== id)
            : [...collapsed, id],
        });
      },
      reset: () => set({ collapsed: [] }),
    }),
    {
      name: "group-storage",
    }
  )
);
