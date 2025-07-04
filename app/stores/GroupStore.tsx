import { create } from "zustand";
import { Group } from "../repositories/types";
import { db } from "../repositories/db";

type State = {
  groups: Group[] | undefined;
};

type Action = {
  loadGroups: () => Promise<void>;
  addGroup: (group: Group) => Promise<boolean>;
  updateGroup: (id: string, group: Partial<Group>) => Promise<boolean>;
  deleteGroup: (id: string) => Promise<boolean>;
  moveGroup: (id: string, beforeId: string | null) => boolean;
};

export const useGroupStore = create<State & Action>((set) => ({
  groups: undefined,

  loadGroups: async () => {
    const groups = await db.groups.toArray();
    set(() => ({ groups }));
  },
  addGroup: async (group: Group) => {
    let prevGroups: Group[] | undefined;

    set((state) => {
      if (!state.groups) {
        return { groups: [group] };
      }
      prevGroups = [...state.groups];
      return { groups: [group, ...state.groups] };
    });

    try {
      await db.groups.add(group);
    } catch (error) {
      console.error("Error adding group:", error);

      // Rollback
      set((states) => {
        if (!states.groups || !prevGroups) return {};
        states.groups = prevGroups;
        return { groups: [...states.groups] };
      });

      return false;
    }
    return true;
  },
  updateGroup: async (id: string, group: Partial<Group>) => {
    let prevGroup: Group | undefined;

    try {
      set((state) => {
        if (!state.groups) return {};

        const target = state.groups.find((h) => h.id === id);
        if (!target) return {};

        prevGroup = structuredClone(target);
        Object.assign(target, group);

        return {};
      });
      await db.groups.update(id, group);
    } catch (error) {
      console.error("Error renaming group:", error);

      // Rollback
      set((states) => {
        if (!states.groups || !prevGroup) return {};

        const index = states.groups.findIndex((h) => h.id === id);
        if (index < 0) return {};

        states.groups[index] = prevGroup;
        return {};
      });

      return false;
    }

    return true;
  },
  deleteGroup: async (id: string) => {
    let prevGroups: Group[] | undefined;

    set((state) => {
      if (!state.groups) return {};

      const index = state.groups.findIndex((h) => h.id === id);
      if (index < 0) return {};

      // const deleteTask = useTaskStore.getState().deleteTask;

      prevGroups = [...state.groups];
      state.groups.splice(index, 1);

      return { groups: [...state.groups] };
    });

    try {
      await db.groups.delete(id);
    } catch (error) {
      console.error("Error deleting group:", error);

      // Rollback
      set((states) => {
        if (!states.groups || !prevGroups) return {};
        states.groups = prevGroups;
        return { groups: [...states.groups] };
      });
      return false;
    }

    return true;
  },
  moveGroup: (id: string, beforeId: string | null) => {
    if (beforeId === id) return true;

    set((state) => {
      if (!state.groups) return {};

      const index = state.groups.findIndex((h) => h.id === id);
      if (index < 0) return {};

      const deletedGroups = state.groups.splice(index, 1);
      if (beforeId === null) {
        state.groups.push(...deletedGroups);
      } else {
        const beforeIndex = state.groups.findIndex(
          (group) => group.id === beforeId
        );
        state.groups.splice(beforeIndex, 0, ...deletedGroups);
      }

      return { groups: [...state.groups] };
    });

    return true;
  },
}));
