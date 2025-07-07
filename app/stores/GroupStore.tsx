import { create } from "zustand";
import { Group } from "../repositories/types";
import { db } from "../repositories/db";
import { immer } from "zustand/middleware/immer";

type State = {
  dummyGroup: Group | undefined;
  groups: Group[] | undefined;
};

type Action = {
  loadGroups: () => Promise<void>;
  addGroup: (group: Group) => Promise<boolean>;
  updateGroup: (id: string, group: Partial<Group>) => Promise<boolean>;
  deleteGroup: (id: string) => Promise<boolean>;
  moveGroup: (id: string, beforeId: string | null) => boolean;
  setDummyGroup: (group: Group | undefined) => void;
};

export const useGroupStore = create<State & Action, [["zustand/immer", never]]>(
  immer((set) => ({
    dummyGroup: undefined,
    groups: undefined,

    loadGroups: async () => {
      const groups = await db.groups.toArray();
      set(() => ({ groups }));
    },
    addGroup: async (group: Group) => {
      set((state) => {
        if (!state.groups) return;
        state.groups.unshift(group);
      });

      try {
        await db.groups.add(group);
      } catch (error) {
        console.error("Error adding group:", error);
        return false;
      }
      return true;
    },
    updateGroup: async (id: string, group: Partial<Pick<Group, "name">>) => {
      set((state) => {
        const target = state.groups?.find((t) => t.id === id);
        if (!target) return;
        Object.assign(target, group);
      });

      try {
        await db.groups.update(id, group);
      } catch (error) {
        console.error("Error renaming group:", error);
        return false;
      }
      return true;
    },
    deleteGroup: async (id: string) => {
      set((state) => {
        if (!state.groups) return;

        const index = state.groups.findIndex((h) => h.id === id);
        if (index < 0) return;

        state.groups.splice(index, 1);
      });

      try {
        await db.groups.delete(id);
      } catch (error) {
        console.error("Error deleting group:", error);
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
      });

      return true;
    },
    setDummyGroup: (group: Group | undefined) =>
      set(() => ({ dummyGroup: group })),
  }))
);
