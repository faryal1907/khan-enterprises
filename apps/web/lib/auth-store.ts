import { create } from "zustand";
import Cookies from "js-cookie";
import type { User } from "./types";

const WEB_ACCESS_TOKEN_COOKIE = "webAccessToken";

interface AuthState {
  user: User | null;
  accessToken: string | null;

  setAuth: (user: User, accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  setAuth: (user, accessToken) => {
    Cookies.set(WEB_ACCESS_TOKEN_COOKIE, accessToken, {
      path: "/",
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    set({ user, accessToken });
  },

  logout: () => {
    Cookies.remove(WEB_ACCESS_TOKEN_COOKIE, { path: "/" });
    set({ user: null, accessToken: null });
  },
}));
