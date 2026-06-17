import axios from "axios";
import Cookies from "js-cookie";

const WEB_ACCESS_TOKEN_COOKIE = "webAccessToken";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  },
});

let isRefreshing = false;
let failedQueue: Array<(token: string) => void> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom(error);
    } else {
      prom(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? Cookies.get(WEB_ACCESS_TOKEN_COOKIE) : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log('API Request:', config.method?.toUpperCase(), config.url, 'params:', JSON.stringify(config.params));

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update cookies
        Cookies.set("accessToken", accessToken, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        Cookies.set("refreshToken", newRefreshToken, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        // Process queued requests
        processQueue(null, accessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        console.log('Retrying original request:', originalRequest.method?.toUpperCase(), originalRequest.url, 'params:', originalRequest.params);
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect to login
        processQueue(refreshError, null);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("user");
        
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
