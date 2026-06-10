import { create } from "zustand";
import Cookies from "js-cookie";
import type { User } from "./types";

interface AuthState {
  user: User | null;
  accessToken: string | null;

  setAuth: (user: User, accessToken: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  setAuth: (user, accessToken) => {
    Cookies.set("accessToken", accessToken, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    Cookies.set("user", JSON.stringify(user), {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    set({ user, accessToken });
  },

  logout: () => {
    Cookies.remove("accessToken");
    Cookies.remove("user");
    set({ user: null, accessToken: null });
  },

  initializeAuth: () => {
    const token = Cookies.get("accessToken");
    const userCookie = Cookies.get("user");
    if (token && userCookie) {
      try {
        const user = JSON.parse(userCookie);
        set({ user, accessToken: token });
      } catch (error) {
        console.error("Failed to parse user from cookie:", error);
        Cookies.remove("accessToken");
        Cookies.remove("user");
      }
    }
  },
}));
