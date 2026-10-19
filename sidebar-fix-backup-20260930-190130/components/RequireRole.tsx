import { Navigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import type { AppRole } from "@/context/AuthContext";

export default function RequireRole({
  role,
  children,
}: {
  role: AppRole;
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}