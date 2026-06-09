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
