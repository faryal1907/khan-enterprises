import { create } from "zustand";
import Cookies from "js-cookie";
import type { User } from "./types";

const ADMIN_ACCESS_TOKEN_COOKIE = "adminAccessToken";

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
    Cookies.set(ADMIN_ACCESS_TOKEN_COOKIE, accessToken, {
      path: "/",
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      domain: process.env.NODE_ENV === "production" ? undefined : "localhost",
    });

    set({ user, accessToken });
  },

  logout: () => {
    Cookies.remove(ADMIN_ACCESS_TOKEN_COOKIE, { 
      path: "/",
      domain: process.env.NODE_ENV === "production" ? undefined : "localhost",
    });
    set({ user: null, accessToken: null });
  },
}));
