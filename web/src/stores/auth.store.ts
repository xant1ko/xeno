import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthResponse, AuthUser } from "../api/auth/auth.types";

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  setSession: (auth: AuthResponse) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,

      setSession: ({ access_token, user }) => {
        set({ accessToken: access_token, user });
      },

      clearSession: () => {
        set({ accessToken: null, user: null });
      },
    }),
    {
      name: "xeno-auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ accessToken, user }) => ({ accessToken, user }),
    },
  ),
);
