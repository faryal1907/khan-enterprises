import axios from "axios";
import Cookies from "js-cookie";

const ADMIN_ACCESS_TOKEN_COOKIE = "adminAccessToken";


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? Cookies.get(ADMIN_ACCESS_TOKEN_COOKIE) : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor: suppress the Next.js dev overlay for API errors
// while keeping the Axios error shape intact so catch blocks can read
// err.response?.data?.message as expected.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Request failed";

    // Use console.warn so the Next.js dev overlay is NOT triggered
    console.warn(`[API ${status ?? "ERR"}]`, message);

    // Re-throw the original Axios error unchanged so that
    // err.response?.data?.message works in every catch block.
    return Promise.reject(error);
  }
);
