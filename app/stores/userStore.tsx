import { create } from "zustand";
import { User } from "../types/user";

type State = {
  user: User | undefined;
};

type Action = {
  setUser: (user: User | undefined) => void;
};

export const useUserStore = create<State & Action>((set) => {
  return {
    user: undefined,
    setUser: (user) => set({ user }),
  };
});
