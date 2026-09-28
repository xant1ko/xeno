import { apiClient } from "../client";
import { useAuthStore } from "../../stores/auth.store";
import type { AuthResponse, AuthUser, LoginRequest } from "../../types";

export const authQueryKeys = {
  me: ["auth", "me"] as const,
};

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials,
    );

    useAuthStore.getState().setUser(response.data.user);

    return response.data;
  },

  async register(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      credentials,
    );

    useAuthStore.getState().setUser(response.data.user);

    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      useAuthStore.getState().clearUser();
    }
  },

  async getCurrentUser(): Promise<AuthUser> {
    const response = await apiClient.get<AuthUser>("/auth/me");
    return response.data;
  },
};
