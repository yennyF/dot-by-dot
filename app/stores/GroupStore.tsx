import { create } from "zustand";
import { Group } from "../repositories/types";
import { immer } from "zustand/middleware/immer";
import { UNGROUPED_KEY, useTaskStore } from "./TaskStore";
import { useTrackStore } from "./TrackStore";
import { LexoRank } from "lexorank";
import {
  notifyCreateError,
  notifyDeleteError,
  notifyMoveError,
  notifyUpdateError,
} from "../components/Notification";
import { db } from "../repositories/db";
import { subscribeWithSelector } from "zustand/middleware";

type State = {
  dummyGroup: Group | undefined;
  groups: Group[] | undefined;
  size: number;
};

type Action = {
  initGroups: () => Promise<void>;
  destroyGroups: () => void;
  addGroup: (props: Pick<Group, "id" | "name">) => void;
  updateGroup: (id: string, props: Pick<Group, "name">) => void;
  deleteGroup: (id: string) => void;
  moveGroupBefore: (id: string, beforeId: string) => void;
  moveGroupAfter: (id: string, afterId: string | null) => void;
  setDummyGroup: (group: State["groups"]) => void;
};

export const useGroupStore = create<State & Action>()(
  subscribeWithSelector(
    immer((set) => ({
      dummyGroup: undefined,
      setDummyGroup: (group: State["groups"]) =>
        set(() => ({ dummyGroup: group })),

      groups: undefined,
      size: 0,
      destroyGroups: async () => {
        set(() => ({ dummyGroup: undefined, groups: undefined }));
      },
      initGroups: async () => {
        try {
          const groups = await db.groups.orderBy("order").toArray();
          set(() => ({ groups }));
        } catch (error) {
          console.error("Error initialing groups:", error);
          throw error;
        }
      },
      addGroup: async (props: Pick<Group, "id" | "name">) => {
        try {
          let group: Group | undefined;

          // Add group
          set(({ groups }) => {
            if (!groups) return;

            const firstOrder = groups[0]?.order;
            const order = firstOrder
              ? LexoRank.parse(firstOrder).genPrev().toString()
              : LexoRank.middle().toString();

            group = { ...props, order };
            groups.unshift(group);
          });

          // Init empty task for group
          useTaskStore.setState(({ tasksByGroup }) => {
            if (!tasksByGroup) return;

            const key = props.id ?? UNGROUPED_KEY;
            tasksByGroup[key] = [];
          });

          if (!group) throw Error();

          await db.groups.add(group);
        } catch (error) {
          console.error("Error adding group:", error);
          notifyCreateError();
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
          notifyUpdateError();
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
            const prev = groups[newIndex - 1];
            const next = groups[newIndex + 1]; // beforeId
            const rank = prev
              ? LexoRank.parse(prev.order).between(LexoRank.parse(next.order))
              : LexoRank.parse(next.order).genPrev();

            // Update group
            order = rank.toString();
            groups[index].order = order;
          });

          if (!order) throw Error();

          await db.tasks.update(id, { order });
        } catch (error) {
          console.error("Error moving group:", error);
          notifyMoveError();
        }
      },
      moveGroupAfter: async (id: string, afterId: string | null) => {
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

            if (afterId) {
              // Add to new position
              const newIndex = groups.findIndex((g) => g.id === afterId);
              if (newIndex < 0) return Error();
              groups.splice(newIndex + 1, 0, group);

              // Calculate new order
              const prev = groups[newIndex - 1]; // afterId
              const next = groups[newIndex + 1];
              const rank = next
                ? LexoRank.parse(prev.order).between(LexoRank.parse(next.order))
                : LexoRank.parse(prev.order).genPrev();
              order = rank.toString();
            } else {
              // Add to new position
              const newIndex = groups.length;
              groups.push(group);

              // Calculate new order
              const prev = groups[newIndex - 1];
              const rank = prev
                ? LexoRank.parse(prev.order).genNext()
                : LexoRank.middle();
              order = rank.toString();
            }

            // Update group
            group.order = order;
          });

          if (!order) throw Error();

          await db.tasks.update(id, { order });
        } catch (error) {
          console.error("Error moving group:", error);
          notifyMoveError();
        }
      },
      deleteGroup: async (id: string) => {
        try {
          // delete track state
          const tasksByGroup = useTaskStore.getState().tasksByGroup;
          if (tasksByGroup) {
            const tasks = tasksByGroup[id];
            if (tasks && tasks.length > 0) {
              useTrackStore.setState((state) => {
                if (!state.tasksByDate) return {};

                const newTasksByDate = { ...state.tasksByDate };

                for (const [date, taskSet] of Object.entries(
                  state.tasksByDate
                )) {
                  const newTaskSet = new Set(taskSet);
                  tasks.forEach((t) => newTaskSet.delete(t.id));
                  newTasksByDate[date] = newTaskSet;
                }

                return { tasksByDate: newTasksByDate };
              });
            }
          }

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
          await db.transaction(
            "rw",
            db.groups,
            db.tasks,
            db.tracks,
            async () => {
              const taskIds = await db.tasks
                .where("groupId")
                .equals(id)
                .primaryKeys();
              if (taskIds.length > 0) {
                await db.tracks.where("taskId").anyOf(taskIds).delete();
              }
              await db.tasks.where("groupId").equals(id).delete();
              await db.groups.delete(id);
            }
          );
        } catch (error) {
          console.error("Error deleting group:", error);
          notifyDeleteError();
        }
      },
    }))
  )
);

useGroupStore.subscribe(
  (state) => state.groups,
  (groups) => {
    useGroupStore.setState((state) => {
      const newSize = groups?.length ?? 0;
      state.size = newSize;
    });
  }
);
