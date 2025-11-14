import { supabase } from "../supabase/server";
import { create } from "zustand";
import {
  ApiGroup,
  Group,
  mapGroupRequest,
  mapGroupResponseArray,
} from "../types";
import { immer } from "zustand/middleware/immer";
import { UNGROUPED_KEY, useTaskStore } from "./taskStore";
import { useTaskLogStore } from "./taskLogStore";
import { LexoRank } from "lexorank";
import {
  notifyCreateError,
  notifyDeleteError,
  notifyMoveError,
  notifyUpdateError,
} from "../components/Notification";
import { subscribeWithSelector } from "zustand/middleware";

type State = {
  dummyGroup: Group | undefined;
  groups: Group[] | undefined;
};

type Action = {
  destroyGroups: () => void;
  setDummyGroup: (group: Group | undefined) => void;
  fetchGroups: () => Promise<void>;
  insertGroup: (props: Pick<Group, "id" | "name">) => void;
  updateGroup: (id: string, props: Pick<Group, "name">) => void;
  moveGroupBefore: (id: string, beforeId: string) => void;
  moveGroupAfter: (id: string, afterId: string | null) => void;
  deleteGroup: (id: string) => void;
};

export const useGroupStore = create<State & Action>()(
  subscribeWithSelector(
    immer((set, get) => ({
      dummyGroup: undefined,
      setDummyGroup: (group: Group | undefined) =>
        set(() => ({ dummyGroup: group })),

      groups: undefined,

      destroyGroups: async () => {
        set(() => ({ dummyGroup: undefined, groups: undefined }));
      },

      fetchGroups: async () => {
        try {
          const { data, error } = await supabase
            .from("groups")
            .select("id, name, order, user_id")
            .order("order", { ascending: true });
          if (error) throw error;

          set(() => ({ groups: mapGroupResponseArray(data ?? []) }));
        } catch (error) {
          console.error(error);
          throw error;
        }
      },

      insertGroup: async (props: Pick<Group, "id" | "name">) => {
        try {
          const key = props.id ?? UNGROUPED_KEY;

          const firstOrder = get().groups?.[0]?.order;
          const rank = firstOrder
            ? LexoRank.parse(firstOrder).genPrev()
            : LexoRank.middle();

          const group: Group = {
            ...props,
            order: rank.toString(),
          };

          // Add group
          set(({ groups }) => {
            (groups ??= []).unshift(group);
          });

          // Init empty task for group
          useTaskStore.setState(({ tasksByGroup }) => {
            if (!tasksByGroup) tasksByGroup = {};
            tasksByGroup[key] = [];
          });

          // insert in db;
          const { error } = await supabase
            .from("groups")
            .insert(mapGroupRequest(group));
          if (error) throw error;
        } catch (error) {
          console.error(error);
          notifyCreateError();
        }
      },

      updateGroup: async (id: string, props: Pick<ApiGroup, "name">) => {
        try {
          set(({ groups }) => {
            if (!groups) return;

            const group = groups.find((g) => g.id === id);
            if (!group) throw Error();

            group.name = props.name;
          });

          // update in db
          const { error } = await supabase
            .from("groups")
            .update(props)
            .eq("id", id);
          if (error) throw error;
        } catch (error) {
          console.error(error);
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

          // update in db
          const { error } = await supabase
            .from("groups")
            .update({ order })
            .eq("id", id);
          if (error) throw error;
        } catch (error) {
          console.error(error);
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

          // update in db
          const { error } = await supabase
            .from("groups")
            .update({ order })
            .eq("id", id);
          if (error) throw error;
        } catch (error) {
          console.error(error);
          notifyMoveError();
        }
      },

      deleteGroup: async (id: string) => {
        try {
          // delete taskLog state
          const tasksByGroup = useTaskStore.getState().tasksByGroup;
          if (tasksByGroup) {
            const tasks = tasksByGroup[id];
            if (tasks && tasks.length > 0) {
              useTaskLogStore.setState((state) => {
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

          const response = await supabase.from("groups").delete().eq("id", id);
          if (response.error) throw response.error;
        } catch (error) {
          console.error(error);
          notifyDeleteError();
        }
      },
    }))
  )
);
