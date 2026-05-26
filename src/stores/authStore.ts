import { create } from "zustand";
import type { UserMyProfileResponse } from "../apis/data-contracts";
import { userApi } from "../api/client";

type AuthState = {
  token: string | null;
  user: UserMyProfileResponse | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  setAuth: (token: string, user: UserMyProfileResponse) => void;
  clearAuth: () => void;

  login: (email: string, password: string) => Promise<void>;
  signup: (params: {
    email: string;
    password: string;
    profile_name: string;
    username: string;
    bio: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  setAuth: (token, user) =>
    set({
      token,
      user,
      isAuthenticated: true,
      error: null,
    }),

  clearAuth: () =>
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null,
    }),

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await userApi.userEmailLogin({ email, password });
      const { user, token_info } = response.data;
      if (token_info && user) {
        set({
          token: token_info.token_value,
          user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      set({ loading: false, error: "Invalid email or password." });
      throw err;
    }
  },

  signup: async ({ email, password, profile_name, username, bio }) => {
    set({ loading: true, error: null });
    try {
      const response = await userApi.userEmailSignup({
        email,
        password,
        profile_name,
        username,
        bio,
      });
      const { user, token_info } = response.data;
      if (token_info && user) {
        set({
          token: token_info.token_value,
          user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      set({ loading: false, error: "Signup failed. Please try again." });
      throw err;
    }
  },

  logout: async () => {
    try {
      await userApi.userLogout({});
    } catch {
      // Server logout failed, but we still clear client state
    }
    get().clearAuth();
  },

  fetchProfile: async () => {
    try {
      const response = await userApi.userMyProfileGet({ api_page: 1 });
      if (response.data) {
        set({ user: response.data });
      }
    } catch {
      // If fetching profile fails, clear auth (token may be expired)
      get().clearAuth();
    }
  },
}))
