import create from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      isDarkTheme: true,
      toggleTheme: () => {
        set((state) => ({ isDarkTheme: !state.isDarkTheme }));
      },
      user: null,
      setUser: (user) => set({ user: user }),
      resetUser: () => set({ user: null }),
    }),
    {
      name: "reddit-clone",
    }
  )
);

export default useStore;
