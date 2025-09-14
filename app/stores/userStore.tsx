import { create } from "zustand";
import { User } from "../types/user";

type State = {
  user: User | null | undefined;
};

type Action = {
  setUser: (user: User | null) => void;
};

export const useUserStore = create<State & Action>((set) => {
  return {
    user: undefined,
    setUser: (user) => set({ user }),
  };
});
