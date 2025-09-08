import { create } from "zustand";
import { User } from "../types/user";

type State = {
  user: User | null;
  loading: boolean;
};

type Action = {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
};

export const useUserStore = create<State & Action>((set) => {
  return {
    user: null,
    setUser: (user) => set({ user }),
    loading: true,
    setLoading: (loading) => set({ loading }),
  };
});
