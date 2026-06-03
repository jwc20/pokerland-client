import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppState = {
  theme: "light" | "dark";
  gameHistoryLogScope: "mine" | "all";
  setTheme: (theme: "light" | "dark") => void;
  setGameHistoryLogScope: (scope: "mine" | "all") => void;
  toggleTheme: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "light",
      gameHistoryLogScope: "mine",
      setTheme: (theme) => set({ theme }),
      setGameHistoryLogScope: (gameHistoryLogScope) => set({ gameHistoryLogScope }),
      toggleTheme: () =>
        set({ theme: get().theme === "light" ? "dark" : "light" }),
    }),
    {
      name: "app-storage",
    }
  )
);
