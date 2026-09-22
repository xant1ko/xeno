import { Navigate } from "react-router";
import { useLocation } from "react-router";

export function RootGuard() {
  const location = useLocation();

  if (location.pathname === "/") {
    return <Navigate to="/overview" />;
  }
}
