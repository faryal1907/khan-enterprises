import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? Cookies.get("accessToken")
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});