"use client";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import type { LoginResponse } from "@/lib/types";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  loginSchema,
  LoginFormValues,
} from "@/lib/validation/login";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
  } = useForm<LoginFormValues>({
    resolver:
      zodResolver(loginSchema),
  });

  const onSubmit = async (
  data: LoginFormValues
) => {
  try {
    const response =
      await api.post<LoginResponse>(
        "/auth/login",
        data
      );

    const {
      accessToken,
      user,
    } = response.data;

    useAuthStore
      .getState()
      .setAuth(
        user,
        accessToken
      );

    window.location.href = "/";

  } catch (error) {
    console.error(error);
  }
};

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="space-y-4"
    >
      <input
        {...register("email")}
        placeholder="Email"
      />

      <input
        type="password"
        {...register("password")}
        placeholder="Password"
      />

      <button type="submit">
        Login
      </button>
    </form>
  );
}