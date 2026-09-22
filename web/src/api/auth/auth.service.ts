import { apiClient } from "../client";
import { useAuthStore } from "../../stores/auth.store";
import type { AuthResponse, LoginRequest } from "./auth.types";

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials,
    );

    useAuthStore.getState().setSession(response.data);

    return response.data;
  },

  logout(): void {
    useAuthStore.getState().clearSession();
  },

  getAccessToken(): string | null {
    return useAuthStore.getState().accessToken;
  },
};
