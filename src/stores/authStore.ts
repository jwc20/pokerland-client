import { create } from "zustand";

type User = {
  id: number;
  username: string;
  email: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  setAuth: (token, user) =>
    set({
      token,
      user,
      isAuthenticated: true,
    }),

  clearAuth: () =>
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    }),
}));
