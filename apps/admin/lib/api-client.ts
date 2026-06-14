import axios from "axios";
import Cookies from "js-cookie";

const ADMIN_ACCESS_TOKEN_COOKIE = "adminAccessToken";


export const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? Cookies.get(ADMIN_ACCESS_TOKEN_COOKIE) : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor: re-throw API errors as plain Errors so they are
// caught silently by component try/catch blocks without triggering the
// Next.js dev overlay (which fires on unhandled Axios rejections).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Request failed";

    // Use console.warn so Next.js dev overlay is NOT triggered
    console.warn(`[API ${status ?? "ERR"}]`, message);

    // Re-throw as a plain Error to keep component catch blocks working
    const plain = new Error(message);
    (plain as any).status = status;
    (plain as any).data = error?.response?.data;
    return Promise.reject(plain);
  }
);
