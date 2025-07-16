import { create } from "zustand";
import { Group } from "../repositories/types";
import { db } from "../repositories/db";
import { immer } from "zustand/middleware/immer";
import { useTaskStore } from "./TaskStore";
import { useTrackStore } from "./TrackStore";
import { LexoRank } from "lexorank";

type State = {
  dummyGroup: Group | undefined;
  groups: Group[] | undefined;
};

type Action = {
  loadGroups: () => Promise<void>;
  addGroup: (props: Pick<Group, "id" | "name">) => void;
  updateGroup: (id: string, props: Pick<Group, "name">) => void;
  deleteGroup: (id: string) => void;
  moveGroupBefore: (id: string, beforeId: string) => void;
  moveGroupAfter: (id: string, afterId: string) => void;
  setDummyGroup: (group: Group | undefined) => void;
};

export const useGroupStore = create<State & Action, [["zustand/immer", never]]>(
  immer((set) => ({
    dummyGroup: undefined,
    groups: undefined,

    loadGroups: async () => {
      const groups = await db.groups.orderBy("order").toArray();
      set(() => ({ groups }));
    },
    addGroup: async (props: Pick<Group, "id" | "name">) => {
      try {
        let group: Group | undefined;

        set(({ groups }) => {
          if (!groups) return;

          const firstOrder = groups[0]?.order;
          const order = firstOrder
            ? LexoRank.parse(firstOrder).genPrev().toString()
            : LexoRank.middle().toString();

          group = { ...props, order };
          groups.unshift(group);
        });

        if (!group) throw Error();
        await db.groups.add(group);
      } catch (error) {
        console.error("Error adding group:", error);
      }
    },
    updateGroup: async (id: string, props: Pick<Group, "name">) => {
      try {
        set(({ groups }) => {
          if (!groups) return;

          const group = groups.find((g) => g.id === id);
          if (!group) throw Error();

          group.name = props.name;
        });

        await db.groups.update(id, props);
      } catch (error) {
        console.error("Error updating group:", error);
      }
    },
    moveGroupBefore: async (id: string, beforeId: string) => {
      if (beforeId === id) return;

      let order: string | undefined;

      try {
        set(({ groups }) => {
          if (!groups) return;

          // Remove from current position
          const index = groups.findIndex((g) => g.id === id);
          if (index < 0) return Error();
          const group = groups[index];
          groups.splice(index, 1);

          // Add to new position
          const newIndex = groups.findIndex((g) => g.id === beforeId);
          if (newIndex < 0) return Error();
          groups.splice(newIndex, 0, group);

          // Calculate new order
          const prevTask = groups[newIndex - 1];
          const nextTask = groups[newIndex + 1]; // beforeId
          const rank = prevTask
            ? LexoRank.parse(prevTask.order).between(
                LexoRank.parse(nextTask.order)
              )
            : LexoRank.parse(nextTask.order).genPrev();

          // Update group
          order = rank.toString();
          groups[index].order = order;
        });

        if (!order) throw Error();
        await db.tasks.update(id, { order });
      } catch (error) {
        console.error("Error moving task:", error);
      }
    },
    moveGroupAfter: async (id: string, afterId: string) => {
      if (afterId === id) return;

      let order: string | undefined;

      try {
        set(({ groups }) => {
          if (!groups) return;

          // Remove from current position
          const index = groups.findIndex((g) => g.id === id);
          if (index < 0) return Error();
          const group = groups[index];
          groups.splice(index, 1);

          // Add to new position
          const newIndex = groups.findIndex((g) => g.id === afterId);
          if (newIndex < 0) return Error();
          const safeIndex = Math.min(newIndex + 1, groups.length);
          groups.splice(safeIndex, 0, group);

          // Calculate new order
          const prevTask = groups[safeIndex - 1];
          const nextTask = groups[safeIndex + 1]; // afterId
          const rank = prevTask
            ? LexoRank.parse(prevTask.order).between(
                LexoRank.parse(nextTask.order)
              )
            : LexoRank.parse(nextTask.order).genPrev();

          // Update group
          order = rank.toString();
          group.order = order;
        });

        if (!order) throw Error();
        await db.tasks.update(id, { order });
      } catch (error) {
        console.error("Error moving task:", error);
      }
    },
    deleteGroup: async (id: string) => {
      try {
        // delete track state
        const tasks = useTaskStore.getState().tasksByGroup?.[id] ?? [];
        useTrackStore.setState((state) => {
          const updatedTasksByDate = { ...state.tasksByDate };
          for (const date in updatedTasksByDate) {
            tasks.forEach((t) => updatedTasksByDate[date].delete(t.id));
          }
          return { tasksByDate: updatedTasksByDate };
        });

        // delete tasks state
        useTaskStore.setState(({ tasksByGroup }) => {
          delete tasksByGroup?.[id];
        });

        // delete group state
        set(({ groups }) => {
          if (!groups) return;

          const index = groups.findIndex((h) => h.id === id);
          if (index < 0) return;

          groups.splice(index, 1);
        });

        // delete from db
        await db.transaction("rw", db.groups, db.tasks, db.tracks, async () => {
          const taskIds = await db.tasks
            .where("groupId")
            .equals(id)
            .primaryKeys();
          if (taskIds.length > 0) {
            await db.tracks.where("taskId").anyOf(taskIds).delete();
          }
          await db.tasks.where("groupId").equals(id).delete();
          await db.groups.delete(id);
        });
      } catch (error) {
        console.error("Error deleting group:", error);
      }
    },
    setDummyGroup: (group: Group | undefined) =>
      set(() => ({ dummyGroup: group })),
  }))
);
