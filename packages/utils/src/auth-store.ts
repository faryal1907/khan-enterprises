import { create } from "zustand";
import Cookies from "js-cookie";
import type { User } from "../../types/src/auth.js";

interface AuthState {
  user: User | null;
  accessToken: string | null;

  setAuth: (
    user: User,
    accessToken: string
  ) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthState>((set) => ({
    user: null,
    accessToken: null,

    setAuth: (user, accessToken) => {
      Cookies.set("accessToken", accessToken, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      set({
        user,
        accessToken,
      });
    },

    logout: () => {
      Cookies.remove("accessToken");

      set({
        user: null,
        accessToken: null,
      });
    },
  }));