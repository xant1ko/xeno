import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { Navigate, Outlet, useLocation } from "react-router";
import { authQueryKeys, authService } from "../api";
import { useAuthStore } from "../stores/auth.store";

export function RequireAuth() {
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const currentUser = useQuery({
    queryKey: authQueryKeys.me,
    queryFn: authService.getCurrentUser,
    retry: false,
  });

  useEffect(() => {
    if (currentUser.data) {
      setUser(currentUser.data);
    }
  }, [currentUser.data, setUser]);

  useEffect(() => {
    if (currentUser.isError) {
      clearUser();
    }
  }, [clearUser, currentUser.isError]);

  if (currentUser.isPending) {
    return <Spin fullscreen/>;
  }

  if (currentUser.isError) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
