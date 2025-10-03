import { create } from "zustand";
import { User } from "../types/user";

type State = {
  user: User | null | undefined;
  email: string | undefined;
};

type Action = {
  setUser: (user: User | null) => void;
  setEmail: (email: string | undefined) => void;
};

export const useUserStore = create<State & Action>((set) => {
  return {
    user: undefined,
    setUser: (user) => set({ user }),
    email: undefined,
    setEmail: (email) => set({ email }),
  };
});
