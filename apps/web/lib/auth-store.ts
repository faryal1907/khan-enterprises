import { create } from "zustand";
import Cookies from "js-cookie";
import type { User } from "./types";

const WEB_ACCESS_TOKEN_COOKIE = "webAccessToken";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;

  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  initializeAuth: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  setAuth: (user, accessToken, refreshToken) => {
    Cookies.set("accessToken", accessToken, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    Cookies.set("refreshToken", refreshToken, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    Cookies.set("user", JSON.stringify(user), {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    set({ user, accessToken, refreshToken });
  },

  setTokens: (accessToken, refreshToken) => {
    Cookies.set("accessToken", accessToken, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    Cookies.set("refreshToken", refreshToken, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    set({ accessToken, refreshToken });
  },

  logout: () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("user");
    set({ user: null, accessToken: null, refreshToken: null });
  },

  initializeAuth: () => {
    const token = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    const userCookie = Cookies.get("user");
    if (token && userCookie) {
      try {
        const user = JSON.parse(userCookie);
        set({ user, accessToken: token, refreshToken });
      } catch (error) {
        console.error("Failed to parse user from cookie:", error);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("user");
      }
    }
  },
}));
